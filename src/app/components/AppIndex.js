import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { auth } from './firebase.js';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { fetchData, saveUserData } from './actions';
import Loading from './Loading';
import { useWindowSize } from 'the-platform';
import ErrorBoundary from './ErrorBoundary';
import Notifications from './Notifications';
import isEmpty from 'lodash.isempty';

const NavBar = Loadable({
    loader: () => import('./Nav'),
    loading: Loading
});

const Calendar = Loadable({
    loader: () => import('./Calendar'),
    loading: Loading
});

const ComingSoon = Loadable({
    loader: () => import('./ComingSoon'),
    loading: Loading
});

const Nutrition = Loadable({
    loader: () => import('./Nutrition'),
    loading: Loading
});

const Settings = Loadable({
    loader: () => import('./Settings'),
    loading: Loading
});

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = dispatch => ({
    fetchData: id => dispatch(fetchData(id)),
    saveUserData: user => dispatch(saveUserData(user))
});

function AppIndex({ fetchData, userData, loading, location, history, userLoading, saveUserData }) {
    const { width } = useWindowSize();

    React.useEffect(
        () => {
            if (!isEmpty(userData) && !userLoading) {
                fetchData(userData.uid);
            } else if (isEmpty(userData) && !userLoading) {
                history.push('/login');
            }
        },
        [userData, userLoading]
    );

    React.useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                saveUserData(user);
            } else {
                history.push('/login');
            }
        });
    });

    if (width < 1024) {
        return <ComingSoon width={width} />;
    } else {
        if (!isEmpty(userData) && !userLoading && !loading) {
            return (
                <React.Fragment>
                    <ErrorBoundary>
                        <NavBar path={location.pathname} width={width} />
                    </ErrorBoundary>

                    <Notifications />

                    <ErrorBoundary>
                        <Route exact path="/" component={Calendar} name="Overview" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/settings" component={Settings} name="Settings" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                    </ErrorBoundary>
                </React.Fragment>
            );
        } else {
            return <Loading />;
        }
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppIndex)
);
