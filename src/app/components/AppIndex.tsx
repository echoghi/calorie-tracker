import React, { Suspense, Fragment, useEffect } from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import Firebase from './firebase';
import { connect } from 'react-redux';
import { fetchData, saveUserData } from './actions';
import Loading from './Loading';
import ErrorBoundary from './Error/ErrorBoundary';
import Notifications from './Notifications';
import NavBar from './Nav';
import isEmpty from 'lodash.isempty';
import firebase from 'firebase';

// routes
const Calendar = React.lazy(() => import('./Calendar'));
const Nutrition = React.lazy(() => import('./Nutrition'));
const Settings = React.lazy(() => import('./Settings'));

interface AdminState {
    data: {};
    day: {
        day: {};
        todayButton: boolean;
        formattedDay: {};
        requestedDate: boolean;
        dayRef: {};
        dayIndex: 0;
    };
    error: boolean;
    userData: firebase.UserInfo | {};
    userLoading: boolean;
    loading: boolean;
    success: boolean;
}

interface Queue {
    duration: number;
    key: number;
    message: string;
    type: string;
}

interface NotificationState {
    queue: Queue[];
    open: boolean;
    duration: number;
    message: string;
    type: string;
}

interface RootState {
    notificationState: NotificationState;
    adminState: AdminState;
}

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
const CalendarImport = () => <Calendar />;
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppIndex)
);
