import React from 'react';
import { connect } from 'react-redux';
// Components
import moment from 'moment';
import Placeholder from './Placeholder';
import PieChart from 'react-minimal-pie-chart';
import ProgressBar from 'react-progress-bar.js';
const { Line } = ProgressBar;
import { Group } from '@vx/group';
import { curveMonotoneX } from '@vx/curve';
import { scaleTime, scaleLinear } from '@vx/scale';
import { AreaClosed } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { LinearGradient } from '@vx/gradient';
import { extent, max } from 'd3-array';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userLoading: state.adminState.userLoading
});

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
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

        window.addEventListener('resize', this.updateWindowDimensions);
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    renderProgressBar(num, total, color) {
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

        const progress = num / total;

        return (
            <Line
                progress={progress}
                options={options}
                initialAnimate
                containerStyle={containerStyle}
                containerClassName={'.progressbar'}
            />
        );
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    renderCalorieGraph(graphData) {
        const width = this.state.width - 350;
        const height = 600;
        const margin = {
            top: 30,
            bottom: 40,
            left: 70,
            right: 30
        };
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;
        const x = d => new Date(d.day); // d.date is unix timestamps
        const y = d => d.calories;

        const xScale = scaleTime({
            range: [0, xMax],
            domain: extent(graphData[0], x)
        });
        console.log(max(graphData[0], y));
        const yScale = scaleLinear({
            range: [yMax, 0],
            domain: [-500, 500]
        });

        return (
            <svg width={width} height={height}>
                <LinearGradient from="#8e81e3" to="#a6c1ee" id="gradient" />
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
                </linearGradient>
                <Group top={margin.top} left={margin.left}>
                    <AxisLeft
                        scale={yScale}
                        top={0}
                        left={0}
                        label={'Net Calories'}
                        stroke={'#1b1a1e'}
                        tickTextFill={'#1b1a1e'}
                    />
                    <AxisBottom scale={xScale} top={yMax} label={'Years'} stroke={'#1b1a1e'} tickTextFill={'#1b1a1e'} />
                    <AreaClosed
                        data={graphData[0]}
                        xScale={xScale}
                        yScale={yScale}
                        x={x}
                        y={y}
                        stroke=""
                        fill={'url(#gradient)'}
                        curve={curveMonotoneX}
                    />
                    <AreaClosed
                        data={graphData[1]}
                        xScale={xScale}
                        yScale={yScale}
                        x={x}
                        y={y}
                        stroke={'red'}
                        strokeOpacity={0.7}
                        strokeDasharray={'5, 5'}
                        fill={'url(#gradient2)'}
                    />
                </Group>
            </svg>
        );
    }

    renderStatBoxes() {
        const { data, loading } = this.props;
        let { calorieBalance, exerciseDays, percentage, graphData, userData } = this.state;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbs = 0;
        let totalGrams = 0;

        if (!_.isEmpty(data) && !graphData[0].length) {
            // deep copy data prop to avoid modifying it directly
            userData = _.cloneDeep(data);
            // Include last 30 days only
            const calendar = userData.calendar.splice(userData.calendar.length - 30, 30);

            for (let i = 0, intake = 0, output = 0; i < calendar.length; i++) {
                // Calorie Balance Stats
                intake += calendar[i].nutrition.calories > 0 ? calendar[i].nutrition.calories : 2000;
                output += calendar[i].fitness.calories > 0 ? calendar[i].fitness.calories : 2000;

                // Macronutrient Stats
                totalProtein += calendar[i].nutrition.protein;
                totalFat += calendar[i].nutrition.fat;
                totalCarbs += calendar[i].nutrition.carbs;
                totalGrams += calendar[i].nutrition.protein + calendar[i].nutrition.fat + calendar[i].nutrition.carbs;

                // Graph Data
                const calDay = calendar[i].day.toDate();
                graphData[0].push({
                    day: calDay,
                    calories:
                        (calendar[i].nutrition.calories > 0 ? calendar[i].nutrition.calories : 2000) -
                        (calendar[i].fitness.calories > 0 ? calendar[i].fitness.calories : 2000)
                });

                graphData[1].push({ day: calDay, calories: 0 });

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
                    percentage = Math.round((exerciseDays.on / 30) * 100);
                }
            }
        }

        return (
            <div>
                <div className="overview">
                    <div className="overview--box">
                        <div className="overview--head">
                            <h4 className="title">Exercise Days</h4>
                            <h4 className="percentage positive">{`${percentage}%`}</h4>
                        </div>
                        <div className="overview--body">
                            {!loading ? (
                                <PieChart
                                    lineWidth={50}
                                    style={{ height: 150, padding: 0, margin: '0 auto 20px', width: 150 }}
                                    data={[
                                        { value: exerciseDays.on, key: 1, color: '#E38627' },
                                        { value: exerciseDays.off, key: 2, color: '#C13C37' }
                                    ]}
                                />
                            ) : (
                                <Placeholder
                                    circle
                                    style={{ height: 150, width: 150, padding: 0, margin: '0 auto 20px' }}
                                />
                            )}
                        </div>
                        <div className="overview--breakdown">
                            <div className="overview--breakdown-exercise">
                                <h4>{exerciseDays.on}</h4>
                                <span>Exercise Days</span>
                                {this.renderProgressBar(exerciseDays.on, 30, '#E38627')}
                            </div>
                            <div className="overview--breakdown-exercise">
                                <h4>{exerciseDays.off}</h4>
                                <span>Rest Days</span>
                                {this.renderProgressBar(exerciseDays.off, 30, '#C13C37')}
                            </div>
                        </div>
                    </div>
                    <div className="overview--box">
                        <div className="overview--head">
                            <h4 className="title">Caloric {calorieBalance.netPositive ? 'Surplus' : 'Deficit'}</h4>
                            <h4 className="percentage">{calorieBalance.value}cal</h4>
                        </div>
                    </div>
                    <div className="overview--box">
                        <div className="overview--head">
                            <h4 className="title">Macronutrients</h4>
                        </div>
                        <div className="overview--body">
                            {!loading && !_.isEmpty(userData) ? (
                                <PieChart
                                    lineWidth={50}
                                    style={{ height: 150, padding: 0, margin: '0 auto 20px', width: 150 }}
                                    data={[
                                        { value: totalProtein, key: 1, color: '#F5729C' },
                                        { value: totalCarbs, key: 2, color: '#7BD4F8' },
                                        { value: totalFat, key: 3, color: '#55F3B3' }
                                    ]}
                                />
                            ) : (
                                <div className="overview__chart--loading" />
                            )}
                        </div>
                        <div className="overview--breakdown">
                            <div className="overview--breakdown-exercise">
                                <h4>{totalProtein ? `${Math.round((totalProtein / totalGrams) * 100)}%` : 0}</h4>
                                <span>Protein</span>
                                {this.renderProgressBar(totalProtein, totalGrams, '#F5729C')}
                            </div>
                            <div className="overview--breakdown-exercise">
                                <h4>{totalCarbs ? `${Math.round((totalCarbs / totalGrams) * 100)}%` : 0}</h4>
                                <span>Carbs</span>
                                {this.renderProgressBar(totalCarbs, totalGrams, '#7BD4F8')}
                            </div>
                            <div className="overview--breakdown-exercise">
                                <h4>{totalFat ? `${Math.round((totalFat / totalGrams) * 100)}%` : 0}</h4>
                                <span>Fat</span>
                                {this.renderProgressBar(totalFat, totalGrams, '#55F3B3')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overview">
                    <div className="overview--box" style={{ width: '100%', display: 'block' }}>
                        <div className="overview--head">
                            <h4 className="title">Caloric {calorieBalance.netPositive ? 'Surplus' : 'Deficit'}</h4>
                            <h4 className="percentage">{calorieBalance.value}cal</h4>
                        </div>
                        <div className="overview--body">{this.renderCalorieGraph(graphData)}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="overview__container">
                    <h1>Overview</h1>
                    <h3>{moment().format('MMMM YYYY')}</h3>
                    {this.renderStatBoxes()}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Home);
