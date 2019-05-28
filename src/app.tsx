import './app/assets/scss/style.scss';
// polyfills
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme, GlobalStyle } from './app/components/theme';
import { store } from './store';
import AppIndex from './app/components/AppIndex';
import Login from './app/components/Login';
import Register from './app/components/Register';
import ResetPassword from './app/components/ResetPassword';
// Service Worker
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login} name="Login" />
                    <Route path="/register" component={Register} name="Register" />
                    <Route path="/reset-password" component={ResetPassword} name="Reset Password" />
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
