import React from 'react';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import { Application } from './components';

export default function AppRouter() {
  const { history } = createHistory();
  return (
    <Router history={ history }>
      <Route path='/' component={ Application } />
    </Router>
  );
}
