import React from 'react';
import { connect } from 'react-redux';
// Components
import moment from 'moment';
import { Doughnut, Line } from 'react-chartjs-2';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userLoading: state.adminState.userLoading
});

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

        window.scrollTo(0, 0);
    }

    renderCalorieGraph() {
        const { data } = this.props;
        let userData;
        let graphData = [];
        let labels = [];

        if (!_.isEmpty(data)) {
            // deep copy data prop to avoid modifying it directly
            userData = _.cloneDeep(data);
            // Include last 30 days only
            const calendar = userData.calendar.splice(userData.calendar.length - 30, 30);

            for (let i = 0; i < calendar.length; i++) {
                // Graph Data
                labels.push(calendar[i].day.format('l'));

                graphData.push(
                    (calendar[i].nutrition.calories > 0 ? calendar[i].nutrition.calories : 2000) -
                        (calendar[i].fitness.calories > 0 ? calendar[i].fitness.calories : 2000)
                );
            }
        }

        const graphConfig = {
            labels: labels,
            datasets: [
                {
                    label: 'Net Caloric Intake',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: graphData
                }
            ]
        };

        return <Line height={250} data={graphConfig} />;
    }

    renderHeaderClass(net) {
        if (net) {
            return 'overview--head surplus';
        } else {
            return 'overview--head defecit';
        }
    }

    renderStatBoxes() {
        const { data, loading } = this.props;
        let { calorieBalance, userData } = this.state;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbs = 0;
        let totalGrams = 0;

        if (!_.isEmpty(data)) {
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

        totalFat = totalFat ? `${Math.round((totalFat / totalGrams) * 100)}%` : 0;
        totalCarbs = totalCarbs ? `${Math.round((totalCarbs / totalGrams) * 100)}%` : 0;
        totalProtein = totalProtein ? `${Math.round((totalProtein / totalGrams) * 100)}%` : 0;

        if (!loading) {
            return (
                <div>
                    <div className="overview">
                        <div className="overview--box xl">
                            <div className={this.renderHeaderClass(calorieBalance.netPositive)}>
                                <h4 className="title">
                                    Caloric {calorieBalance.netPositive ? 'Surplus' : 'Deficit'} of{' '}
                                    {calorieBalance.value}cal
                                </h4>
                            </div>
                            <div className="overview--body">{this.renderCalorieGraph(userData)}</div>
                        </div>
                    </div>
                    <div className="overview">
                        <div className="overview--box">
                            <div className="overview--head">
                                <h4 className="title">Macronutrients</h4>
                            </div>
                            <div className="overview--body sm">
                                <Doughnut
                                    height={150}
                                    width={150}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                    data={{
                                        datasets: [
                                            {
                                                data: [totalProtein, totalCarbs, totalFat],
                                                backgroundColor: ['#F5729C', '#7BD4F8', '#55F3B3'],
                                                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                                            }
                                        ],

                                        labels: [
                                            `${totalProtein}% Protein (g)`,
                                            `${totalCarbs}% Carbs (g)`,
                                            `${totalFat}% Fat (g)`
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                        <div className="overview--box">
                            <div className="overview--head">
                                <h4 className="title">Macronutrients</h4>
                            </div>
                            <div className="overview--body sm">
                                <Doughnut
                                    height={150}
                                    width={150}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                    data={{
                                        datasets: [
                                            {
                                                data: [totalProtein, totalCarbs, totalFat],
                                                backgroundColor: ['#F5729C', '#7BD4F8', '#55F3B3'],
                                                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                                            }
                                        ],

                                        labels: [
                                            `${totalProtein}% Protein (g)`,
                                            `${totalCarbs}% Carbs (g)`,
                                            `${totalFat}% Fat (g)`
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                        <div className="overview--box">
                            <div className="overview--head">
                                <h4 className="title">Macronutrients</h4>
                            </div>
                            <div className="overview--body sm">
                                <Doughnut
                                    height={150}
                                    width={150}
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                    data={{
                                        datasets: [
                                            {
                                                data: [totalProtein, totalCarbs, totalFat],
                                                backgroundColor: ['#F5729C', '#7BD4F8', '#55F3B3'],
                                                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                                            }
                                        ],

                                        labels: [
                                            `${totalProtein}% Protein (g)`,
                                            `${totalCarbs}% Carbs (g)`,
                                            `${totalFat}% Fat (g)`
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
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
