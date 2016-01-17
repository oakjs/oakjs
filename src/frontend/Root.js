import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import AppRouter from "./AppRouter";
import * as reducers from './reducers';

const reducer = combineReducers(reducers);
const finalCreateStore = applyMiddleware(thunk)(createStore);
const store = finalCreateStore(reducer);

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <AppRouter/>
      </Provider>
    );
  }
}
