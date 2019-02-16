import React, { Suspense } from 'react';
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

// no lambda
const CalendarImport = () => import('./Calendar');
const NutritionImport = () => import('./Nutrition');
const SettingsImport = () => import('./Settings');
// routes
const Calendar = React.lazy(CalendarImport);
const Nutrition = React.lazy(NutritionImport);
const Settings = React.lazy(SettingsImport);

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

const mapDispatchToProps = (dispatch: any) => ({
    getData: (id: string) => dispatch(fetchData(id)),
    saveUser: (user: firebase.UserInfo) => dispatch(saveUserData(user))
});

interface AppIndex extends RouteComponentProps {
    getData: (id: string) => void;
    saveUser: (user: firebase.UserInfo) => void;
    userData: firebase.UserInfo;
    data: {};
    loading: boolean;
    userLoading: boolean;
}

function AppIndex({ getData, userData, data, loading, history, userLoading, saveUser }: AppIndex) {
    Firebase.auth.onAuthStateChanged(user => {
        if (user) {
            saveUser(user);
        } else {
            history.push('/login');
        }
    });

    React.useEffect(() => {
        if (!isEmpty(userData) && !userLoading) {
            getData(userData.uid);
        } else if (isEmpty(userData) && !userLoading) {
            history.push('/login');
        }
    }, [userData]);

    return (
        <div>
            {!loading && !userLoading && !isEmpty(userData) && !isEmpty(data) ? (
                <React.Fragment>
                    <NavBar />
                    <Notifications />
                    <Suspense fallback={<Loading />}>
                        <ErrorBoundary>
                            <Route exact path="/" render={() => <Calendar />} name="Overview" />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route path="/settings" render={() => <Settings />} name="Settings" />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route
                                path="/nutrition"
                                render={() => <Nutrition />}
                                name="Nutrition"
                            />
                        </ErrorBoundary>
                    </Suspense>
                </React.Fragment>
            ) : null}
        </div>
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppIndex)
);
