import React from 'react';
import { connect } from 'react-redux';
import { activatePage, fetchData, loadNutritionData } from './actions';
import moment from 'moment';
import ProgressBar from 'react-progressbar.js';
let { Circle } = ProgressBar;
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
// Components
import NavBar from './NavBar';
// Images
import runnerIcon from '../assets/images/apple-runner.png';
//import firebase from './firebase.js';

const mapStateToProps = state => ({
    calendar: state.navigationState.calendar,
    data: state.adminState.data,
    loading: state.adminState.loading
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page)),
    fetchData: () => dispatch(fetchData()),
    loadNutritionData: data => dispatch(loadNutritionData(data))
});

class Calendar extends React.Component {
    state = {
        time: moment()
    };

    componentWillMount() {
        const { calendar, activatePage, fetchData, data, loading } = this.props;
        window.scrollTo(0, 0);

        if (!calendar) {
            activatePage('calendar');
        }

        if (_.isEmpty(data) && !loading) {
            fetchData();
        }
        /*
		let update = {};

		update['users/-L1W7yroxzFV-EPpK63D/calendar/44/nutrition/meals'] = [
			{
				name: "In n' Out 3x3",
				type: 'Fast Food',
				calories: 860,
				fat: 55,
				carbs: 39,
				protein: 52
			},
			{
				name: "In n' Out animal fries",
				type: 'Fast Food',
				calories: 750,
				fat: 42,
				carbs: 54,
				protein: 19
			}
		];

		update['users/-L1W7yroxzFV-EPpK63D/calendar/45'] = {
				day: {
					month: 0,
					date: 8,
					year: 2017
				},
				mood: 4,
				nutrition: {
					calories: 0,
					fat: 0,
					carbs: 0,
					protein: 0
				},
				fitness: {
					calories: 0,
					exercise: 0,
					stand: 0
				}
			}

		firebase.database().ref().update(update);
		*/
    }

    navigateToNutrition(day) {
        let { data, loadNutritionData } = this.props;
        let dayData;

        for (let i = 0; i < data.calendar.length; i++) {
            if (
                data.calendar[i].day.date() === day.date() &&
                data.calendar[i].day.month() === day.month() &&
                data.calendar[i].day.year() === day.year()
            ) {
                dayData = data.calendar[i];
            }
        }

        loadNutritionData(dayData);
    }

    renderDayProgressCircles(day) {
        const { data } = this.props;
        let { time } = this.state;
        let now = moment();
        let animate;
        let calorieGoal = day.fitness.calories ? day.fitness.calories : data.user.goals.nutrition.calories;
        let calorieProgress = day.nutrition.calories / calorieGoal;
        let proteinProgress = day.nutrition.protein / data.user.goals.nutrition.protein;
        let carbProgress = day.nutrition.carbs / data.user.goals.nutrition.carbs;
        let fatProgress = day.nutrition.fat / data.user.goals.nutrition.fat;

        // Only animate today's calendar box
        if (now.date() === day.day.date() && now.month() === day.day.month() && now.year() === day.day.year()) {
            animate = false;

            if (day.day.month() === time.month()) {
                animate = true;
            }
        }

        // Prevent progress bar bug by converting 100%+ to 100%
        calorieProgress = calorieProgress > 1 ? (calorieProgress = 1) : calorieProgress;
        proteinProgress = proteinProgress > 1 ? (proteinProgress = 1) : proteinProgress;
        carbProgress = carbProgress > 1 ? (carbProgress = 1) : carbProgress;
        fatProgress = fatProgress > 1 ? (fatProgress = 1) : fatProgress;

        const calorieOptions = {
            strokeWidth: 6,
            color: '#8E81E3',
            trailColor: '#f4f4f4'
        };
        const calorieContainerStyle = {
            width: '90px',
            height: '90px',
            margin: '0 auto'
        };
        const proteinOptions = {
            strokeWidth: 7,
            color: '#F5729C',
            trailColor: '#f4f4f4'
        };
        const proteinContainerStyle = {
            width: '70px',
            height: '70px',
            margin: '-80px auto'
        };
        const carbOptions = {
            strokeWidth: 8,
            color: '#7BD4F8',
            trailColor: '#f4f4f4'
        };
        const carbContainerStyle = {
            width: '50px',
            height: '50px',
            margin: '20px auto'
        };
        const fatOptions = {
            strokeWidth: 9,
            color: '#55F3B3',
            trailColor: '#f4f4f4'
        };
        const fatContainerStyle = {
            width: '30px',
            height: '30px',
            margin: '-60px auto'
        };

        return (
            <div className="day__overview">
                <Circle
                    progress={calorieProgress}
                    options={calorieOptions}
                    initialAnimate={animate}
                    containerStyle={calorieContainerStyle}
                    containerClassName={'.day__overview--calories'}
                />
                <Circle
                    progress={proteinProgress}
                    options={proteinOptions}
                    initialAnimate={animate}
                    containerStyle={proteinContainerStyle}
                    containerClassName={'.day__overview--protein'}
                />
                <Circle
                    progress={carbProgress}
                    options={carbOptions}
                    initialAnimate={animate}
                    containerStyle={carbContainerStyle}
                    containerClassName={'.day__overview--carbs'}
                />
                <Circle
                    progress={fatProgress}
                    options={fatOptions}
                    initialAnimate={animate}
                    containerStyle={fatContainerStyle}
                    containerClassName={'.day__overview--fats'}
                />
            </div>
        );
    }

    handleDayClass(day) {
        let { time } = this.state;
        let now = moment();

        if (now.date() === day.date() && now.month() === day.month() && now.year() === day.year()) {
            if (day.month() !== time.month()) {
                return 'day today inactive';
            } else {
                return 'day today';
            }
        } else if (day.month() !== time.month()) {
            return 'day inactive';
        } else {
            return 'day';
        }
    }

    renderExerciseIcon(data, day) {
        const { time } = this.state;

        if (data && data.fitness.exercise >= 30 && day.month() === time.month()) {
            return (
                <img
                    className="exercise__icon"
                    src={runnerIcon}
                    data-for={`${day.date()}-${day.get('month')}`}
                    data-tip="tooltip"
                />
            );
        }
    }

    renderExerciseTooltip(data, day) {
        if (data && data.fitness.exercise >= 30) {
            return (
                <ReactTooltip class="exercise_tip" type="info" id={`${day.date()}-${day.get('month')}`}>
                    <span>You met your exercise goal with {data.fitness.exercise} minutes of activity</span>
                </ReactTooltip>
            );
        }
    }

    handleIconClass(day) {
        let now = moment();
        let { data } = this.props;
        let dayData;

        for (let i = 0; i < data.calendar.length; i++) {
            if (
                data.calendar[i].day.date() === day.date() &&
                data.calendar[i].day.month() === day.month() &&
                data.calendar[i].day.year() === day.year()
            ) {
                dayData = data.calendar[i];
            }
        }

        if (now.isAfter(day) && dayData && day.month() === now.month()) {
            return 'icon-info';
        } else {
            return 'icon-info hidden';
        }
    }

    renderDays() {
        let { time } = this.state;
        const { data } = this.props;
        let calendarDays = [];
        let calendar = [];
        const startWeek = time
            .clone()
            .startOf('month')
            .week();
        const endWeek = time
            .clone()
            .endOf('month')
            .week();

        if (startWeek > endWeek) {
            calendar = [
                {
                    week: 48,
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(48)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                },
                {
                    week: 49,
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(49)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                },
                {
                    week: 50,
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(50)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                },
                {
                    week: 51,
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(51)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                },
                {
                    week: 52,
                    days: Array(14)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(52)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                }
            ];
        } else {
            for (let week = startWeek; week <= endWeek; week++) {
                calendar.push({
                    week: week,
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(week)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    data: []
                });
            }
        }

        for (let i = 0; i < calendar.length; i++) {
            for (let j = 0; j < calendar[i].days.length; j++) {
                // Map data to calendar day
                for (let k = 0; k < data.calendar.length; k++) {
                    if (
                        data.calendar[k].day.date() === calendar[i].days[j].date() &&
                        data.calendar[k].day.month() === calendar[i].days[j].month() &&
                        data.calendar[k].day.year() === calendar[i].days[j].year()
                    ) {
                        calendar[i].data[j] = data.calendar[k];
                    }
                }

                calendarDays.push(
                    <div
                        className={this.handleDayClass(calendar[i].days[j])}
                        key={`${calendar[i].days[j].date()}-${calendar[i].days[j].get('month')}-${Math.random()}`}
                    >
                        <div className="number">{calendar[i].days[j].date()}</div>
                        {this.renderExerciseIcon(calendar[i].data[j], calendar[i].days[j])}
                        {calendar[i].data[j] && moment().isSameOrAfter(calendar[i].days[j])
                            ? this.renderDayProgressCircles(calendar[i].data[j])
                            : ''}
                        <Link to="/nutrition">
                            <span
                                onClick={() => this.navigateToNutrition(calendar[i].days[j])}
                                className={this.handleIconClass(calendar[i].days[j])}
                            />
                        </Link>
                        {this.renderExerciseTooltip(calendar[i].data[j], calendar[i].days[j])}
                    </div>
                );
            }
        }

        return calendarDays;
    }

    changeMonth(bool) {
        let { time } = this.state;
        time = time.clone();

        if (bool) {
            if (time.get('month') === 11) {
                time = moment([time.get('year') + 1, 0, 1]);
            } else {
                time = moment([time.get('year'), time.get('month') + 1, 1]);
            }
        } else {
            if (time.get('month') === 0) {
                time = moment([time.get('year') - 1, 11, 1]);
            } else {
                time = moment([time.get('year'), time.get('month') - 1, 1]);
            }
        }

        this.setState({ time });
    }

    renderPlaceholders() {
        return Array(42)
            .fill(0)
            .map((n, i) => (
                <div className={`day loading ${n}`} key={i}>
                    <div className="number" />
                    <div className="circle" />
                    <div className="info" />
                </div>
            ));
    }

    renderLegend() {
        return (
            <div className="legend">
                <div className="legend__header">Legend</div>
                <div className="legend__body">
                    <div className="legend__body--item">
                        <div className="legend__body--calories" />
                        <div className="legend__body--name">Calories</div>
                    </div>
                    <div className="legend__body--item">
                        <div className="legend__body--protein" />
                        <div className="legend__body--name">Protein</div>
                    </div>
                    <div className="legend__body--item">
                        <div className="legend__body--carbs" />
                        <div className="legend__body--name">Carbs</div>
                    </div>
                    <div className="legend__body--item">
                        <div className="legend__body--fat" />
                        <div className="legend__body--name">Fat</div>
                    </div>
                    <div className="legend__body--item">
                        <div className="legend__body--subhead">Icons</div>
                    </div>
                    <div className="legend__body--item">
                        <img src={runnerIcon} />
                        <div className="legend__body--name">Exercise goal</div>
                    </div>
                    <div className="legend__body--item">
                        <i className="icon-info" />
                        <div className="legend__body--name">Nutrition breakdown</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let { time } = this.state;
        let { loading, data } = this.props;
        let month = time.format('MMMM');
        let year = time.format('YYYY');
        console.log(data);
        return (
            <div>
                <NavBar />

                <div className="calendar">
                    <div className="calendar__toggle--month">
                        <i className="icon-chevron-left" onClick={() => this.changeMonth(false)} />
                        <h2>{month}</h2>
                        <i className="icon-chevron-right" onClick={() => this.changeMonth(true)} />
                    </div>
                    <h4>{year}</h4>
                    <div className="calendar__wrapper">
                        <div className="calendar__container">
                            <div className="calendar__head">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>
                            {!_.isEmpty(data) && !loading ? this.renderDays() : this.renderPlaceholders()}
                        </div>
                        {this.renderLegend()}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
