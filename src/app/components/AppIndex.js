import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchData } from './actions';

// Components
import NavBar from './NavBar';
import Home from './Home';
import Calendar from './Calendar';
import Nutrition from './Nutrition';
import Activity from './Activity';
import Settings from './Settings';

const mapStateToProps = state => ({
    home: state.navigationState.home,
    data: state.adminState.data,
    loading: state.adminState.loading
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => dispatch(fetchData())
});

class AppIndex extends React.PureComponent {
    componentWillMount() {
        const { fetchData, loading, data } = this.props;

        if (_.isEmpty(data) && !loading) {
            fetchData();
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/settings" component={Settings} name="Settings" />
                    <Route path="/calendar" component={Calendar} name="Calendar" />
                    <Route path="/nutrition" component={Nutrition} name="Nutrition" />
                    <Route path="/activity" component={Activity} name="Activity" />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppIndex);
