/**
 * Fitness Tracker 1.0.0
 * Copyright (c) Emile Choghi 2017
 *
 */

// SCSS
/*eslint-disable*/
import Styles from './app/assets/scss/style.scss';
import _ from 'lodash';
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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './app/components/Home';
import Nutrition from './app/components/Nutrition';
import Activity from './app/components/Activity';
import Calendar from './app/components/Calendar';
import Settings from './app/components/Settings';

const adminApp = combineReducers({
    adminState,
    navigationState
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = composeEnhancers(applyMiddleware(thunk))(createStore)(
    adminApp
);

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path={'/'} component={Home} />
                <Route path={'/nutrition'} component={Nutrition} />
                <Route path={'/activity'} component={Activity} />
                <Route path={'/calendar'} component={Calendar} />
                <Route path={'/settings'} component={Settings} />
            </Router>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('app')
);
