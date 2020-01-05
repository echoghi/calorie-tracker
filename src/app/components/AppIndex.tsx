import React, { Suspense, Fragment, useEffect, lazy } from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmpty from 'lodash.isempty';
import firebase from 'firebase';

import { fetchData, saveUserData } from './actions';
import Firebase from './firebase';
import Loading from './Loading';
import ErrorBoundary from './Error/ErrorBoundary';
import Notifications from './Notifications';
import NavBar from './Nav';
import { RootState } from './types';

// routes
const Calendar = lazy(() => import('./Calendar'));
const Nutrition = lazy(() => import('./Nutrition'));
const Settings = lazy(() => import('./Settings'));

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = {
    getData: (id: string) => fetchData(id),
    saveUser: (user: firebase.UserInfo) => saveUserData(user)
};

interface AppIndex extends RouteComponentProps {
    getData: (id: string) => void;
    saveUser: (user: firebase.UserInfo) => void;
    userData: firebase.UserInfo;
    data: {};
    loading: boolean;
    userLoading: boolean;
}

const SettingsImport = () => <Settings />;
const CalendarImport = (props: RouteComponentProps) => <Calendar {...props} />;
const NutritionImport = () => <Nutrition />;

function AppIndex({ getData, userData, data, loading, history, userLoading, saveUser }: AppIndex) {
    useEffect(() => {
        Firebase.auth.onAuthStateChanged(user => {
            if (user) {
                saveUser(user);
            } else {
                history.push('/login');
            }
        });
    }, [history, saveUser]);

    useEffect(() => {
        if (!isEmpty(userData) && !userLoading) {
            getData(userData.uid);
        } else if (isEmpty(userData) && !userLoading) {
            history.push('/login');
        }
    }, [userData, history, getData, userLoading]);

    return (
        <div>
            {!loading && !userLoading && !isEmpty(userData) && !isEmpty(data) ? (
                <Fragment>
                    <NavBar />
                    <Notifications />
                    <Suspense fallback={<Loading />}>
                        <ErrorBoundary>
                            <Route exact={true} path="/" render={CalendarImport} name="Overview" />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route path="/settings" render={SettingsImport} name="Settings" />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route path="/nutrition" render={NutritionImport} name="Nutrition" />
                        </ErrorBoundary>
                    </Suspense>
                </Fragment>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));
