import React from 'react';
import { connect } from 'react-redux';
import { activatePage, fetchData } from './actions';
// Components
import NavBar from './NavBar';
import moment from 'moment';
import PieChart from 'react-minimal-pie-chart';
import { AreaChart } from 'react-easy-chart';
import ProgressBar from 'react-progressbar.js';
const { Line } = ProgressBar;

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
        },
        graphData: [[], []],
        percentage: 0
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

    renderProgressBar(num, color) {
        const options = {
            strokeWidth: 5,
            color: color,
            trailColor: '#eff3f6'
        };

        const containerStyle = {
            width: '90%',
            margin: '10px auto',
            marginLeft: 0
        };

        const progress = num / 30;

        return (
            <Line
                progress={progress}
                options={options}
                initialAnimate={true}
                containerStyle={containerStyle}
                containerClassName={'.progressbar'}
            />
        );
    }

    renderStatBoxes() {
        const { data } = this.props;
        let { calorieBalance, exerciseDays, percentage, graphData, userData } = this.state;
        console.log('graphData', graphData);
        console.log('percentage', percentage);
        console.log('exercise', exerciseDays);
        if (!_.isEmpty(data) && !graphData[0].length) {
            // deep copy data prop to avoid modifying it directly
            userData = _.cloneDeep(data);
            // Include last 30 days only
            const calendar = userData.calendar.splice(userData.calendar.length - 30, 30);

            for (let i = 0, intake = 0, output = 0; i < calendar.length; i++) {
                // Calorie Balance Stats
                intake += calendar[i].nutrition.calories;
                output += calendar[i].fitness.calories;

                // Graph Data
                const calDay = calendar[i].day.format('D-MMM-YY');
                graphData[0].push({ x: calDay, y: calendar[i].nutrition.calories - calendar[i].fitness.calories });
                graphData[1].push({ x: calDay, y: 0 });

                // Exercise Days Stat
                calendar[i].fitness.exercise >= 30 ? exerciseDays.on++ : exerciseDays.off++;

                if (i + 1 === calendar.length) {
                    if (intake > output) {
                        calorieBalance.netPositive = true;
                        calorieBalance.value = intake - output;
                    } else {
                        calorieBalance.netPositive = false;
                        calorieBalance.value = output - intake;
                    }

                    // Percentage of Days exercised
                    percentage = Math.round(exerciseDays.on / 30 * 100);
                }
            }
        }

        return (
            <div className="overview">
                <div className="overview--box">
                    <div className="overview--head">
                        <h4 className="title">Exercise Days</h4>
                        <h4 className="percentage positive">{`${percentage}%`}</h4>
                    </div>
                    <div className="overview--body">
                        {exerciseDays.on || exerciseDays.off ? (
                            <PieChart
                                lineWidth={50}
                                style={{ height: 150, padding: 0, margin: '0 auto 20px', width: 150 }}
                                data={[
                                    { value: exerciseDays.on, key: 1, color: '#E38627' },
                                    { value: exerciseDays.off, key: 2, color: '#C13C37' }
                                ]}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="overview--breakdown">
                        <div className="overview--breakdown-exercise">
                            <h4>{exerciseDays.on}</h4>
                            <span>Exercise Days</span>
                            {this.renderProgressBar(exerciseDays.on, '#E38627')}
                        </div>
                        <div className="overview--breakdown-exercise">
                            <h4>{exerciseDays.off}</h4>
                            <span>Rest Days</span>
                            {this.renderProgressBar(exerciseDays.off, '#C13C37')}
                        </div>
                    </div>
                </div>
                <div className="overview--box">
                    <div className="overview--head">
                        <h4 className="title">Caloric {calorieBalance.netPositive ? 'Surplus' : 'Deficit'}</h4>
                        <h4 className="percentage">{calorieBalance.value}cal</h4>
                    </div>
                    <div className="overview--body">
                        {graphData[0].length ? (
                            <AreaChart
                                axes
                                grid
                                verticalGrid
                                interpolate={'cardinal'}
                                xType={'time'}
                                xTicks={4}
                                yTicks={10}
                                yDomainRange={[-1000, 300]}
                                areaColors={['blue', 'black']}
                                margin={{ top: 25, right: 0, bottom: 25, left: 0 }}
                                axisLabels={{ x: 'Day', y: 'Net Calories' }}
                                width={450}
                                height={275}
                                data={graphData}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className="overview--box">
                    <div className="overview--head">
                        <h1>0</h1>
                        <h3>Consecutive Exercise Days</h3>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="overview__container">
                    <h1>Overview</h1>
                    <h3>{moment().format('MMMM YYYY')}</h3>
                    {this.renderStatBoxes()}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
