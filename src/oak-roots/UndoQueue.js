//////////////////////////////
//  Generic Undo Queue
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { mapOwn } from "oak-roots/util/object";

export default class UndoQueue {
  constructor(props) {
    if (props) Object.assign(this, props);
  }

  // Cursor in the undo queue.
  // Generally, the cursor will be just past the last transaction in the queue.
  // If we're in the middle of undoing, the cursor will be in the middle of the queue.
  cursor = 0;

  // Queue of undo transactions.
  // We add new transactions to the end.
  // See `cursor`.
  transactions = [];

  // Max number of items in the queue.
  maxLength = 100;

  // Transaction that's currently pending.
  // If you're performing a multi-step action which should be undoable together,
  // call `startTransaction()` FIRST to start a transaction,
  // then call `endTransaction()` when you're done.
  transaction = undefined;


  //////////////////////////////
  //  State
  //////////////////////////////

  // Can we currently undo or redo?
  get canUndo() { return !!this._getUndoTransaction() }
  get canRedo() { return !!this._getRedoTransaction() }

  // Return the title to display for the current `undo` action.
  // Returns `undefined` if no undo is possible.
  get undoTitle() {
    const transaction = this._getUndoTransaction();
    return transaction && transaction.undoTitle;
  }

  // Return the title to display for the current `undo` action.
  // Returns `undefined` if no undo is possible.
  get redoTitle() {
    const transaction = this._getRedoTransaction();
    return transaction && transaction.redoTitle;
  }


  //////////////////////////////
  //  Undo / redo
  //////////////////////////////

  undo() {
//TODO: what if there's a pending transaction?
    const transaction = this._getUndoTransaction();
    if (!transaction) {
      console.warn(`undoQueue.undo(): Attempting to UNDO when nothing in the queue`, this);
      return undefined;
    }

    this.cursor--;
    transaction.undo();
  }

  redo() {
//TODO: what if there's a pending transaction?
    const transaction = this._getRedoTransaction();
    if (!transaction) {
      console.warn(`undoQueue.undo(): Attempting to REDO past the end of the queue`, this);
      return undefined;
    }

    this.cursor++;
    transaction.redo();
  }


  //////////////////////////////
  //  Adding actions to the queue
  //////////////////////////////

  // Add `undoActions` and `redoActions` to the "current" transaction.
  // You can pass a single function or an array of functions.
  //
  // If a transaction is pending, this will add them to that transaction.
  // If no transaction is pending, this creates a new transaction, adds the actions and commits it.
  // Thus if you call this with no transaction pending, you'll get a new atomic undo.
  addActions(redoActions, undoActions, options = {}) {
    let commit = false;
    if (!this.transaction) {
      this.transaction = this.startTransaction(options.actionName);
      commit = true;
    }

    this.transaction.addUndoActions(undoActions);
    this.transaction.addRedoActions(redoActions);

    if (commit) this.transaction.commit(options.execute);
  }

  // Add a `transaction` to the queue.
  //
  // If a transaction is pending, this will append actions to that transaction.
  //
  // If no transaction is pending, this will add the transaction and commits it.
  // Thus if you call this with no transaction pending, you'll get a new atomic undo.
  addTransaction(transaction, options = {}) {
    // If a transaction is pending, add to that transaction.
    if (this.transaction) {
      this.transaction.addTransaction(transaction);
    }
    else {
      this._addAndCommitTransaction(transaction, options);
    }
    return transaction;
  }


  //////////////////////////////
  //  Transactions
  //////////////////////////////

  // Start a long-running transaction.
// TODO: start the tickler!
// TODO: accept guard condition
// TODO: what to do if in the middle of a transaction???
  startTransaction(actionName) {
    // if we're already in the middle of a transaction,
    // return `undefined` as a signal.
    if (this.transaction) {
      console.log(`startTransaction(${actionName}) called while transaction is active`);
      console.log(this.transaction);
      return undefined;
    }

    this.transaction = new UndoTransaction({ actionName, queue: this });
    return this.transaction;
  }


// TODO: CANCEL TRANSACTION???

  // Add an action *which must already be completed* to the queue.
  // You should NOT call this, create a `transaction` and `commit()` it instead.
  _addAndCommitTransaction(transaction) {
    if (this.transaction && this.transaction !== transaction) {
      console.log("undoQueue._addAndCommitTransaction() called on transaction which is not current!", transaction);
      console.trace();
      return;
    }

    // if we're in the middle of the queue, cut off everything after the current point
    if (this.cursor !== this.transactions.length) {
      this.transactions = this.transactions.slice(0, this.cursor);
    }

    delete this.transaction;
    this.transactions.push(transaction);

    transaction.commit();

    // if we're beyond the number of transactions we should have, remove from the beginnning
    const itemsToRemove = this.transactions.length - this.maxLength;
    if (itemsToRemove > 0) this.transactions = this.transactions.slice(itemsToRemove);

    // reset the cursor just past the end of the list
    this.cursor = this.transactions.length;
  }

  // Create a new transaction by mapping `method` over a `list`,
  //  assuming each return of method will return a sub-transaction.
  static mapTransactions(list, method, actionName) {
    const transaction = new UndoTransaction({actionName});

    const subTransactions = list.map( (item, index, list) => method(item, index, list) );
    transaction.addTransactions(subTransactions);

    return transaction;
  }


  //////////////////////////////
  //  Utility
  //////////////////////////////


  // Return transaction we will `undo` next.
  // Returns `undefined` if nothing to undo.
  _getUndoTransaction() { return this.transactions[this.cursor - 1]; }

  // Return transaction we will `redo` next.
  // Returns `undefined` if nothing to redo.
  _getRedoTransaction() { return this.transactions[this.cursor]; }

}



//////////////////////////////
//  UndoTransaction
//////////////////////////////

export class UndoTransaction {
  constructor(props = {}) {
    this.undoActions = [];
    this.redoActions = [];

    let { transactions, autoExecute = true, ...others } = props;

    // get other properties first
    Object.assign(this, others);

    // assign transactions
    if (transactions) this.addTransactions(value);

    // autoExecute?
    if (autoExecute) {
      oak.undoQueue.addTransaction(this);
    }

    return this;
  }

  // Default name for the transaction, WITHOUT the "undo" or "redo" bit.
  // Set this when constructing the transaction for a more informative UI.
  actionName = "";

  // Has this transaction been committed?
  committed = false;

//TODO:  execute the redo?
  commit(execute = true) {
    if (this.committed) {
      console.log("undoTransaction.commit() called on committed transaction!", this);
      return;
    }
    this.committed = true;
// TODO: try....
//console.log("executing", this);
    if (execute) this.redo();
//    this.queue._addAndCommitTransaction(this);
  }


  //////////////////////////////
  //  Undo / redo
  //////////////////////////////

  undo() {
    this.undoActions.forEach(method => method())
  }

  redo() {
    this.redoActions.forEach(method => method())
  }

// REFACTOR: I think the following will chain undo() routines if they return promises...
//   undo() {
//     return this.undoActions.reduce( (promise, method) => {
//       return promise.then( Promise.resolve(method()) );
//     }, Promise.resolve());
//   }
//
//   redo() {
//     return this.redoActions.reduce( (promise, method) => {
//       return promise.then( Promise.resolve(method()) );
//     }, Promise.resolve());
//   }


  //////////////////////////////
  //  Adding undo / redo actions
  //////////////////////////////

  // Add an action to the `undo` portion of this transaction.
  // NOTE: we expect `args` to be `[method, arg1, arg2, arg3...]`
  addUndoAction(action) {
    this.undoActions.push(action);
  }

  // Add an action to the `redo` portion of this transaction.
  // NOTE: we expect `args` to be `[method, arg1, arg2, arg3...]`
  addRedoAction(action) {
    this.redoActions.push(action);
  }

  // Add a map of `{ context: args }` to the `undo` portion of this transaction.
  // See `addUndoAction()` for `args` semantics.
  addUndoActions(actions) {
    if (Array.isArray(actions)) {
      actions.forEach( action => this.addUndoAction(action) );
    }
    else {
      this.addUndoAction(action);
    }
  }

  // Add a map of `{ context: args }` to the `redo` portion of this transaction.
  // See `addRedoAction()` for `args` semantics.
  addRedoActions(actions) {
    if (Array.isArray(actions)) {
      actions.forEach( action => this.addRedoAction(action) );
    }
    else {
      this.addRedoAction(action);
    }
  }

  //////////////////////////////
  //  Adding (nested) transactions
  //////////////////////////////

  addTransaction(transaction) {
    this.addRedoActions(transaction.redoActions);
    this.addUndoActions(transaction.undoActions);
  }

  addTransactions(transactions) {
    transactions = transactions.filter(Boolean);

    // Add redo actions in NORMAL order
    transactions.forEach(transaction => {
      this.addRedoActions(transaction.redoActions);
    });

    // Add undo actions in REVERSE order
    transactions.reverse().forEach(transaction => {
      this.addUndoActions(transaction.undoActions);
    });
  }


  //////////////////////////////
  //  Reflection
  //////////////////////////////

  get undoTitle() {
    if (this.actionName) return `Undo ${this.actionName}`;
    return "Undo";
  }

  get redoTitle() {
    if (this.actionName) return `Redo ${this.actionName}`;
    return "Redo";
  }

}

