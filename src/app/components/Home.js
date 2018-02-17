import React from 'react';
import { connect } from 'react-redux';
import { activatePage, fetchData } from './actions';
// Components
import NavBar from './NavBar';
import moment from 'moment';

const mapStateToProps = state => ({
    home: state.navigationState.home,
    data: state.adminState.data,
    loading: state.adminState.loading
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page)),
    fetchData: () => dispatch(fetchData())
});

class Home extends React.Component {
    state = {
        loading: true,
        error: null,
        exerciseDays: {
            on: 0,
            off: 0
        },
        calorieBalance: {
            netPositive: false,
            value: 0
        }
    };

    componentWillMount() {
        const { home, activatePage, fetchData, loading, data } = this.props;
        window.scrollTo(0, 0);

        if (_.isEmpty(data) && !loading) {
            fetchData();
        }

        if (!home) {
            activatePage('home');
        }
    }

    renderStatBoxes(data) {
        let { calorieBalance, exerciseDays } = this.state;

        if (!_.isEmpty(data)) {
            // copy data prop to avoid modifying it directly
            data = [...data];
            // Include last 30 days only
            const calendar = data[0].calendar.splice(data[0].calendar.length - 30, 30);

            for (let i = 0, intake = 0, output = 0; i < calendar.length; i++) {
                // Calorie Balance Stats
                intake += calendar[i].nutrition.calories;
                output += calendar[i].fitness.calories;

                // Exercise Day Stats
                calendar[i].fitness.exercise >= 30 ? exerciseDays.on++ : exerciseDays.off++;

                if (i + 1 === calendar.length) {
                    if (intake > output) {
                        calorieBalance.netPositive = true;
                        calorieBalance.value = intake - output;
                    } else {
                        calorieBalance.netPositive = false;
                        calorieBalance.value = output - intake;
                    }
                }
            }
        }

        return (
            <div className="overview">
                <div className="overview--box">
                    <div className="overview--head">
                        <h1>{exerciseDays.on}</h1>
                        <h3>Days Exercised</h3>
                    </div>
                </div>
                <div className="overview--box">
                    <div className="overview--head">
                        <h1>0</h1>
                        <h3>Consecutive Exercise Days</h3>
                    </div>
                </div>
                <div className="overview--box">
                    <div className="overview--head">
                        <h1>{calorieBalance.value}</h1>
                        <span>cal</span>
                        <h3>{calorieBalance.netPositive ? 'Surplus' : 'Deficit'}</h3>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { data } = this.props;

        return (
            <div>
                <NavBar />
                <div className="overview__container">
                    <h1>Overview</h1>
                    <h3>{moment().format('MMMM YYYY')}</h3>
                    {this.renderStatBoxes(data)}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
