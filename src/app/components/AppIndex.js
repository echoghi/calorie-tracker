import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { auth } from './firebase.js';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { fetchData, saveUserData } from './actions';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import isEmpty from 'lodash.isempty';

const NavBar = Loadable({
    loader: () => import('./Nav/NavBar'),
    loading: Loading
});

const SubNav = Loadable({
    loader: () => import('./Nav/SubNav'),
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

class AppIndex extends React.PureComponent {
    state = {
        width: 0
    };

    componentWillReceiveProps(nextProps) {
        const { fetchData, userData, history, userLoading } = this.props;

        if (userData !== nextProps.userData || userLoading !== nextProps.userLoading) {
            if (!isEmpty(nextProps.userData) && !nextProps.userLoading) {
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

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    render() {
        const { userData, userLoading, loading, location } = this.props;
        const { width } = this.state;

        if (width < 1024) {
            return <ComingSoon width={width} />;
        } else {
            if (!isEmpty(userData) && !userLoading && !loading) {
                return (
                    <div>
                        <ErrorBoundary>
                            <NavBar path={location.pathname} width={width} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <SubNav path={location.pathname} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route exact path="/" component={Calendar} name="Overview" />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Route path="/settings" component={Settings} name="Settings" />
                        </ErrorBoundary>

                        <ErrorBoundary>
                            <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                        </ErrorBoundary>
                    </div>
                );
            } else {
                return <Loading />;
            }
        }
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppIndex)
);
