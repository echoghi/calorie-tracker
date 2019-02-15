import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//Reducers
import { adminState, notificationState } from './app/components/reducers';

const adminApp = combineReducers({
    adminState,
    notificationState
});

// Manually enable/disable Redux dev tools
const enableReduxDevTools = true;
let activeComposer;

if (enableReduxDevTools) {
    activeComposer = composeWithDevTools({
        features: {
            dispatch: true, // dispatch custom actions or action creators
            export: true, // export history of actions in a file
            jump: true, // jump back and forth (time travelling)
            lock: true, // lock/unlock dispatching actions and side effects
            pause: true, // start/pause recording of dispatched actions
            persist: true, // persist states on page reloading
            reorder: false, // drag and drop actions in the history list
            skip: true, // skip (cancel) actions
            test: true // generate tests for the selected actions
        },
        latency: 600,
        maxAge: 10,
        serialize: {
            options: undefined
        }
    });
} else {
    activeComposer = compose;
}

export const store = activeComposer(applyMiddleware(thunk))(createStore)(adminApp);
