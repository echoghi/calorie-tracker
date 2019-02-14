import React, { Suspense } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Firebase from './firebase.js';
import { connect } from 'react-redux';
import { fetchData, saveUserData } from './actions';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import Notifications from './Notifications';
import NavBar from './Nav';
import isEmpty from 'lodash.isempty';

// no lambda
const CalendarImport = () => import('./Calendar');
const NutritionImport = () => import('./Nutrition');
const SettingsImport = () => import('./Settings');
// routes
const Calendar = React.lazy(CalendarImport);
const Nutrition = React.lazy(NutritionImport);
const Settings = React.lazy(SettingsImport);

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

function AppIndex({ fetchData, userData, data, loading, history, userLoading, saveUserData }) {
    Firebase.auth.onAuthStateChanged(user => {
        if (user) {
            saveUserData(user);
        } else {
            history.push('/login');
        }
    });

    React.useEffect(() => {
        if (!isEmpty(userData) && !userLoading) {
            fetchData(userData.uid);
        } else if (isEmpty(userData) && !userLoading) {
            history.push('/login');
        }
    }, [userData]);

    return (
        <React.Fragment>
            <NavBar />
            <Notifications />

            {!loading && !userLoading && !isEmpty(userData) && !isEmpty(data) && (
                <Suspense fallback={<Loading />}>
                    <ErrorBoundary>
                        <Route exact path="/" component={Calendar} name="Overview" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/settings" component={Settings} name="Settings" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                    </ErrorBoundary>
                </Suspense>
            )}
        </React.Fragment>
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppIndex)
);
