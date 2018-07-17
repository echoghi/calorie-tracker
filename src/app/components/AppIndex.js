import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { auth } from './firebase.js';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { fetchData, saveUserData } from './actions';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';

const NavBar = Loadable({
    loader: () => import('./NavBar'),
    loading: Loading
});

const SubNav = Loadable({
    loader: () => import('./SubNav'),
    loading: Loading
});

const ComingSoon = Loadable({
    loader: () => import('./ComingSoon'),
    loading: Loading
});

const Calendar = Loadable({
    loader: () => import('./Calendar'),
    loading: Loading
});

const Nutrition = Loadable({
    loader: () => import('./Nutrition'),
    loading: Loading
});

const Activity = Loadable({
    loader: () => import('./Activity'),
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

class AppIndex extends React.PureComponent {
    componentWillReceiveProps(nextProps) {
        const { fetchData, userData, history, userLoading } = this.props;

        if (userData !== nextProps.userData || userLoading !== nextProps.userLoading) {
            if (!_.isEmpty(nextProps.userData) && !nextProps.userLoading) {
                fetchData(nextProps.userData.uid);
            } else {
                history.push('/login');
            }
        }
    }

    componentDidMount() {
        const { saveUserData, history } = this.props;

        auth.onAuthStateChanged(user => {
            if (user) {
                saveUserData(user);
            } else {
                history.push('/login');
            }
        });
    }

    render() {
        const { userData, userLoading, loading, location } = this.props;

        if (!_.isEmpty(userData) && !userLoading && !loading) {
            return (
                <div>
                    <ErrorBoundary>
                        <NavBar path={location.pathname} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <SubNav path={location.pathname} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route exact path="/" component={ComingSoon} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/settings" component={Settings} name="Settings" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/calendar" component={Calendar} name="Calendar" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Route path="/activity" component={Activity} name="Activity" />
                    </ErrorBoundary>
                </div>
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
