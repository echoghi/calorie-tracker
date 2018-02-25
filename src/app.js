/**
 * Fitness Tracker 1.0.0
 * Copyright (c) Emile Choghi 2017
 *
 */

/*eslint-disable*/
import Styles from './app/assets/scss/style.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';
/*eslint-enable*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import 'whatwg-fetch';

//Reducers
import { adminState, navigationState } from './app/components/reducers';

//components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppIndex from './app/components/AppIndex';

const adminApp = combineReducers({
    adminState,
    navigationState
});

// Manually enable/disable Redux dev tools
const enableReduxDevTools = true;
let activeComposer;

if (enableReduxDevTools) {
    activeComposer = composeWithDevTools({
        features: {
            pause: true, // start/pause recording of dispatched actions
            lock: true, // lock/unlock dispatching actions and side effects
            persist: true, // persist states on page reloading
            export: true, // export history of actions in a file
            jump: true, // jump back and forth (time travelling)
            skip: true, // skip (cancel) actions
            reorder: false, // drag and drop actions in the history list
            dispatch: true, // dispatch custom actions or action creators
            test: true // generate tests for the selected actions
        },
        serialize: {
            options: undefined
        },
        latency: 600,
        maxAge: 10
    });
} else {
    activeComposer = compose;
}

export const store = activeComposer(applyMiddleware(thunk))(createStore)(adminApp);

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={AppIndex} />
                </Switch>
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('app')
);
