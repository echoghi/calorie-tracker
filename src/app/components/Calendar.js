import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CircleProgress from './CircleProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Fade from '@material-ui/core/Fade';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Icon = styled.i`
    position: absolute;
    height: 22px;
    width: 22px;
    box-sizing: border-box;
    padding: 1px 4.5px;
    top: 15px;
    right: 10px;
    font-size: 14px;
    text-align: center;
    border-radius: 50%;

    &.icon-feather {
        background: #ece7fe;
        color: #6031e1;
    }

    &.icon-star-full {
        color: #ffba00;
        background: #ffefe7;
    }

    &.legend {
        position: relative;
        min-width: 0;
        top: 0;
        right: 0;
        margin: 0;
        border: none;
    }

    &:before {
        vertical-align: middle;
    }
`;

// Images
import runnerIcon from '../assets/images/apple-runner.png';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: moment()
        };

        window.scrollTo(0, 0);
    }

    renderDayProgressCircles(day) {
        const { data } = this.props;
        const { calories, protein, carbs, fat } = day.nutrition;
        let { time } = this.state;
        let now = moment();
        let animate;
        const calorieGoal = day.fitness.calories ? day.fitness.calories : data.user.goals.calories;
        let calorieProgress = calories / calorieGoal;
        let proteinProgress = protein / data.user.goals.protein;
        let carbProgress = carbs / data.user.goals.carbs;
        let fatProgress = fat / data.user.goals.fat;

        const trailColor = '#f4f4f4';

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
            trailColor
        };
        const calorieContainerStyle = {
            size: 90,
            yOffSet: -1,
            xOffSet: 1
        };
        const proteinOptions = {
            strokeWidth: 6,
            color: '#F5729C',
            trailColor
        };
        const proteinContainerStyle = {
            size: 70,
            xOffSet: 1,
            yOffSet: -87
        };
        const carbOptions = {
            strokeWidth: 5,
            color: '#7BD4F8',
            trailColor
        };
        const carbContainerStyle = {
            size: 50,
            xOffSet: 1,
            yOffSet: -153
        };
        const fatOptions = {
            strokeWidth: 5,
            color: '#55F3B3',
            trailColor
        };
        const fatContainerStyle = {
            size: 30,
            xOffSet: 1,
            yOffSet: -199
        };

        return (
            <div className="day__overview">
                <CircleProgress
                    progress={calorieProgress}
                    options={calorieOptions}
                    animate={animate}
                    containerStyle={calorieContainerStyle}
                    containerClassName={'day__overview--calories'}
                />
                <CircleProgress
                    progress={proteinProgress}
                    options={proteinOptions}
                    animate={animate}
                    containerStyle={proteinContainerStyle}
                    containerClassName={'day__overview--protein'}
                />
                <CircleProgress
                    progress={carbProgress}
                    options={carbOptions}
                    animate={animate}
                    containerStyle={carbContainerStyle}
                    containerClassName={'day__overview--carbs'}
                />
                <CircleProgress
                    progress={fatProgress}
                    options={fatOptions}
                    animate={animate}
                    containerStyle={fatContainerStyle}
                    containerClassName={'day__overview--fats'}
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

    renderIcons(data, day) {
        const { time } = this.state;

        if (data && day.month() === time.month()) {
            if (data.notes && data.fitness.activities) {
                return (
                    <Tooltip
                        id="tooltip-top"
                        title={`You recorded ${data.notes.length} note(s) and ${
                            data.fitness.activities.length
                        } exercise(s)`}
                        placement="top"
                    >
                        <Icon className="icon-star-full" />
                    </Tooltip>
                );
            } else if (data.notes && !data.fitness.activities) {
                return (
                    <Tooltip id="tooltip-top" title={`You recorded ${data.notes.length} note(s)`} placement="top">
                        <Icon className="icon-feather" />
                    </Tooltip>
                );
            } else if (data.fitness.activities) {
                return (
                    <Tooltip
                        id="tooltip-top"
                        title={`You recorded ${data.fitness.activities.length} exercise(s)`}
                        placement="top"
                    >
                        <img className="exercise__icon" src={runnerIcon} />
                    </Tooltip>
                );
            }
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

        if (now.isAfter(day) && dayData) {
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
                        {this.renderIcons(calendar[i].data[j], calendar[i].days[j])}
                        {calendar[i].data[j] && moment().isSameOrAfter(calendar[i].days[j]) ? (
                            this.renderDayProgressCircles(calendar[i].data[j])
                        ) : (
                            <div className="day__overview" />
                        )}
                        <a onClick={() => this.setState({ breakdown: true, breakdownDay: calendar[i].days[j] })}>
                            <span className={this.handleIconClass(calendar[i].days[j])} />
                        </a>
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
                        <div className="legend__body--name">Exercise Recorded</div>
                    </div>
                    <div className="legend__body--item">
                        <Icon className="icon-feather legend" />
                        <div className="legend__body--name">Notes Recorded</div>
                    </div>
                    <div className="legend__body--item">
                        <Icon className="icon-star-full legend" />
                        <div className="legend__body--name">Notes & Exercise</div>
                    </div>
                    <div className="legend__body--item">
                        <i className="icon-info" />
                        <div className="legend__body--name">Day Breakdown</div>
                    </div>
                </div>
            </div>
        );
    }

    renderBreakdown = () => {
        const { breakdown, breakdownDay } = this.state;

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

        if (breakdown) {
            return (
                <Dialog open={breakdown} onClose={() => this.setState({ breakdown: false })}>
                    <DialogTitle>{breakdownDay.format('MMMM Do, YYYY')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            If you've got a smart watch or fitness tracker, you can add your fitness stats in the
                            activity tab. This will override your calculated total daily energy expenditure (TDEE) and
                            keep your data more accurate. If you've taken notes for the day, they'll show up here.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={buttonStyle}
                            component={Link}
                            to={`/nutrition?d=${breakdownDay.format('x')}`}
                            color="primary"
                        >
                            View Nutrition
                        </Button>
                        <Button
                            style={buttonStyle}
                            component={Link}
                            to={`/activity?d=${breakdownDay.format('x')}`}
                            color="primary"
                            autoFocus
                        >
                            View Activity
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    render() {
        let { time } = this.state;
        let { loading, data } = this.props;
        let month = time.format('MMMM');
        let year = time.format('YYYY');

        return (
            <div>
                <Fade in={true}>
                    <div className="calendar">
                        <div className="calendar__toggle--month">
                            <IconButton aria-label="Last Month" component="div" onClick={() => this.changeMonth(false)}>
                                <i className="icon-chevron-left" />
                            </IconButton>

                            <h2>{month}</h2>
                            <IconButton aria-label="Next Month" component="div" onClick={() => this.changeMonth(true)}>
                                <i className="icon-chevron-right" />
                            </IconButton>
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
                </Fade>

                {this.renderBreakdown()}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Calendar);
