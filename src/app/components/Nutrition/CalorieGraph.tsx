import React from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { ChartContainer, ChartBox, MealsHeader } from './styles';
// @ts-ignore
import { Line } from 'react-chartjs-2';
import { RootState } from '../types';
import moment from 'moment';
import config from 'Config';

const mapStateToProps = (state: RootState) => ({
    stateData: state.adminState.data,
    userData: state.adminState.userData
});

function CalorieGraph({ userData, stateData }: any) {
    /**
     * Prepares Datasets for Chart.js graphs
     */
    function makeData() {
        const queryRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child('calendar');

        let data: any;
        let months: number[] = [];
        let calories: number[] = [];
        let mean: any[] = [];
        let goals: any[] = [];
        let days: string[] = [];

        queryRef.once('value', (snapshot: any) => {
            data = snapshot.val();
        });

        for (let i = 0; i < data.length; i++) {
            const { month, date, year } = data[i].day;

            if (!months.includes(month)) {
                months.push(month);
            }

            if (data[i].nutrition.calories) {
                calories.push(data[i].nutrition.calories);

                months.push(month);
            }

            if (i + 1 === data.length) {
                const recentCalories = calories.slice(-30);

                const average = recentCalories.reduce((a, b) => a + b) / recentCalories.length;
                mean = Array.from({ length: 30 }, () => average);
                goals = Array.from({ length: 30 }, () => stateData.user.goals.calories);
            }

            days.push(moment([year, month, date]).format('MMM Do YY'));
        }

        return {
            calories,
            days,
            goals,
            mean
        };
    }

    const { calories, days, goals, mean } = makeData();

    return (
        <ChartBox>
            <MealsHeader>
                <span>30 Day Calorie Consumption</span>
            </MealsHeader>
            <ChartContainer>
                <Line
                    data={{
                        labels: days.slice(-30),
                        datasets: [
                            {
                                label: 'Calories',
                                fill: false,
                                lineTension: 0.5,
                                backgroundColor: config.palette.macros.calorie.color,
                                borderColor: config.palette.macros.calorie.trailColor,
                                borderWidth: 2,
                                data: calories.slice(-30)
                            },
                            {
                                label: 'Average',
                                fill: false,
                                radius: 0,
                                lineTension: 0.5,
                                backgroundColor: '#ECF7FD',
                                borderColor: '#82AAC3',
                                borderWidth: 1,
                                data: mean
                            },
                            {
                                label: 'Goal',
                                fill: false,
                                radius: 0,
                                lineTension: 0.5,
                                backgroundColor: 'green',
                                borderColor: 'green',
                                borderWidth: 1,
                                data: goals
                            }
                        ]
                    }}
                    options={{
                        title: {
                            display: false,
                            text: 'Daily Calorie Consumption',
                            fontSize: 20
                        },
                        legend: {
                            display: true
                        }
                    }}
                />
            </ChartContainer>
        </ChartBox>
    );
}

// export default connect(mapStateToProps)(CalorieGraph);
