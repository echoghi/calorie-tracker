import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { adminState, mealState, notificationState } from './app/components/reducers';

const adminApp = combineReducers({
    adminState,
    mealState,
    notificationState
});

export const store = compose(applyMiddleware(thunk))(createStore)(adminApp);
