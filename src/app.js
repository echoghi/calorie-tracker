/**
 * Fitness Tracker 1.0.0
 * Copyright (c) Emile Choghi 2017
 * 
 */

 // SCSS
/*eslint-disable*/
import Styles from './app/assets/scss/style.scss';
/*eslint-enable*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import 'whatwg-fetch';

//Reducers
import { adminState, navigationState } from './app/components/reducers';

//components
import Home from './app/components/Home';
import Tracker from './app/components/Tracker';
import Reports from './app/components/Reports';
import Calendar from './app/components/Calendar';
import Settings from './app/components/Settings';

const portfolioApp = combineReducers({
    adminState,
    navigationState
}); 

export const store = compose(applyMiddleware(thunk))(createStore)(portfolioApp);

ReactDOM.render(
     <Provider store={store}>
        <Router history={hashHistory}>
            <Route path={'/'} component={Home} />
            <Route path={'/tracker'} component={Tracker} />
            <Route path={'/reports'} component={Reports} />
            <Route path={'/calendar'} component={Calendar} />
            <Route path={'/settings'} component={Settings} />
        </Router>
    </Provider>,
    document.getElementById('app')
);