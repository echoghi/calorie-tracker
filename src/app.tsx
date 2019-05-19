import './app/assets/scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import smoothscroll from 'smoothscroll-polyfill';
import { theme } from './app/components/theme';
import { store } from './store';
import AppIndex from './app/components/AppIndex';
import Login from './app/components/Login';
import Register from './app/components/Register';
// Service Worker
import registerServiceWorker from './registerServiceWorker';
// polyfills
import './polyfills';
smoothscroll.polyfill();

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login} name="Login" />
                    <Route path="/register" component={Register} name="Register" />
                    <Route path="/" component={AppIndex} />
                </Switch>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);

if (NODE_ENV === 'production') {
    registerServiceWorker();
}
