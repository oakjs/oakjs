//////////////////////////////
//  Generic Undo Queue
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { mapOwn } from "oak-roots/util/object";

export default class UndoQueue {
  constructor(props) {
    if (props) Object.assign(this, props);
  }

  // Queue of undo transactions.
  // We add new transactions to the end.
  // See `cursor`.
  transactions = [];

  // Cursor in the undo queue.
  // Generally, the cursor will be just past the last transaction in the queue.
  // If we're in the middle of undoing, the cursor will be in the middle of the queue.
  @proto
  cursor = 0;

  // Max number of items in the queue.
  @proto
  maxLength = 100;

  // Transaction that's currently pending.
  // If you're performing a multi-step action which should be undoable together,
  // call `startTransaction()` FIRST to start a transaction,
  // then call `endTransaction()` when you're done.
  @proto
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
  // If a transaction is pending, this will add them to that transaction.
  // If no transaction is pending, this creates a new transaction, adds the actions and commits it.
  // Thus if you call this with no transaction pending, you'll get a new atomic undo.
  add(undoActions, redoActions, actionName) {
    const startedWithTransaction = !!this.transaction;

    const transaction = this.transaction || this.startTransaction(actionName);
    transaction.addUndoActions(undoActions);
    transaction.addRedoActions(redoActions);

    if (startedWithTransaction) transaction.commit();
  }



  //////////////////////////////
  //  Transactions
  //////////////////////////////

  startTransaction(actionName) {
    // if we're already in the middle of a transaction,
    // return `undefined` as a signal.
    if (this.transaction) {
      console.log(`startTransaction(${actionName}) called while transaction is active`);
      console.log(this.transaction);
      return undefined;
    }

// TODO: start the tickler!
// TODO: accept guard condition
    this.transaction = new UndoTransaction({ name:actionName, queue: this });
    return this.transaction;
  }


// TODO: CANCEL TRANSACTION???

  // Add an action *which must already be completed* to the queue.
  // You should NOT call this, create a `transaction` and `commit()` it instead.
  _addTransaction(transaction) {
    if (this.transaction !== transaction) {
      console.log("undoQueue._addTransaction() called on transaction which is not current!", transaction);
      console.trace();
      return;
    }

    // if we're in the middle of the queue, cut off everything after the current point
    if (this.cursor !== this.transactions.length) {
      this.transactions = this.transactions.slice(0, this.cursor);
    }

    delete this.transaction;
    this.transactions.push(transaction);

    // if we're beyond the number of transactions we should have, remove from the beginnning
    const itemsToRemove = this.maxLength - this.transactions.length;
    if (itemsToRemove > 0) this.transactions = this.transactions.slice(itemsToRemove);

    // reset the cursor just past the end of the list
    this.cursor = this.transactions.length;
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
  constructor(props) {
    Object.assign(this, props);
    this.undoActions = {};
    this.redoActions = {};
  }

  // Has this transaction been committed?
  @proto
  committed = false;

  // Default name for the transaction, WITHOUT the "undo" or "redo" bit.
  // Set this when constructing the transaction for a more informative UI.
  @proto
  name = "";

//TODO:  execute the redo?
  commit() {
    if (this.committed) {
      console.log("undoTransaction.commit() called on committed transaction!", this);
      return;
    }
    this.committed = true;
    this.queue._addTransaction(this);
  }

  //////////////////////////////
  //  Undo / redo
  //////////////////////////////

  undo() {
    this.undoActions.forEach(([method, ...args]) => {
      method(...args);
    })
  }

  redo() {
    this.redoActions.forEach(([method, ...args]) => {
      method(...args);
    })
  }


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
    actions.forEach( action => this.addUndoAction(action) )
  }

  // Add a map of `{ context: args }` to the `redo` portion of this transaction.
  // See `addRedoAction()` for `args` semantics.
  addRedoActions(actions) {
    actions.forEach( action => this.addRedoAction(action) )
  }



  //////////////////////////////
  //  Reflection
  //////////////////////////////

  get undoTitle() {
    if (this.name) return `Undo ${this.name}`;
    return "Undo";
  }

  get redoTitle() {
    if (this.name) return `Redo ${this.name}`;
    return "Redo";
  }

}

