import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchData } from './actions';

// Components
import NavBar from './NavBar';
import Home from './Home';
import Calendar from './Calendar';
import Nutrition from './Nutrition';
import Activity from './Activity';
import Settings from './Settings';
import ErrorBoundary from './ErrorBoundary';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    fetchData: id => dispatch(fetchData(id))
});

class AppIndex extends React.PureComponent {
    constructor(props) {
        super(props);

        if (_.isEmpty(this.props.userData)) {
            this.props.history.push('/login');
        }
    }

    componentWillReceiveProps(nextProps) {
        const { fetchData, userData, history } = this.props;

        if (userData !== nextProps.userData) {
            if (!_.isEmpty(nextProps.userData)) {
                fetchData(nextProps.userData.uid);
            } else {
                history.push('/login');
            }
        }
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <NavBar path={this.props.location.pathname} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Route exact path="/" component={Home} />
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
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));
