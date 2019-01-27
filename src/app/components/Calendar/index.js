import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CircleProgress from '../CircleProgress';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import isEmpty from 'lodash.isempty';
import DaySummary from './DaySummary';
import Legend from './Legend';
// Images
import runnerIcon from '../../assets/images/apple-runner.png';
import { Icon } from './styles';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

const Calendar = ({ data, loading }) => {
    let [time, setTime] = React.useState(moment());
    const [mounted] = React.useState(false);
    let [dayDetails, toggleBreakdown] = React.useState({ active: false, day: moment() });

    React.useEffect(
        () => {
            window.scrollTo(0, 0);
        },
        [mounted]
    );

    function renderDayProgressCircles(day) {
        const { calories, protein, carbs, fat } = day.nutrition;
        let now = moment();
        let animate;
        let calorieProgress = calories / data.user.goals.calories;
        let proteinProgress = protein / data.user.goals.protein;
        let carbProgress = carbs / data.user.goals.carbs;
        let fatProgress = fat / data.user.goals.fat;

        const trailColor = '#f4f4f4';

        // Only animate today's calendar box
        if (
            now.date() === day.day.date() &&
            now.month() === day.day.month() &&
            now.year() === day.day.year()
        ) {
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

        const options = {
            calorie: {
                strokeWidth: 6,
                color: '#8E81E3',
                trailColor,
                container: {
                    size: 90,
                    yOffSet: -1,
                    xOffSet: 1
                }
            },
            protein: {
                strokeWidth: 6,
                color: '#F5729C',
                trailColor,
                container: {
                    size: 70,
                    xOffSet: 1,
                    yOffSet: -87
                }
            },
            carb: {
                strokeWidth: 5,
                color: '#7BD4F8',
                trailColor,
                container: {
                    size: 50,
                    xOffSet: 1,
                    yOffSet: -153
                }
            },
            fat: {
                strokeWidth: 5,
                color: '#55F3B3',
                trailColor,
                container: {
                    size: 30,
                    xOffSet: 1,
                    yOffSet: -199
                }
            }
        };

        return (
            <div className="day__overview">
                <CircleProgress
                    progress={calorieProgress}
                    options={options.calorie}
                    animate={animate}
                    containerStyle={options.calorie.container}
                />
                <CircleProgress
                    progress={proteinProgress}
                    options={options.protein}
                    animate={animate}
                    containerStyle={options.protein.container}
                />
                <CircleProgress
                    progress={carbProgress}
                    options={options.carb}
                    animate={animate}
                    containerStyle={options.carb.container}
                />
                <CircleProgress
                    progress={fatProgress}
                    options={options.fat}
                    animate={animate}
                    containerStyle={options.fat.container}
                />
            </div>
        );
    }

    function handleDayClass(day) {
        const now = moment();

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

    function renderIcons(data, day) {
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
                    <Tooltip
                        id="tooltip-top"
                        title={`You recorded ${data.notes.length} note(s)`}
                        placement="top"
                    >
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

    function handleIconClass(day) {
        for (let i = 0; i < data.calendar.length; i++) {
            if (
                data.calendar[i].day.date() === day.date() &&
                data.calendar[i].day.month() === day.month() &&
                data.calendar[i].day.year() === day.year()
            ) {
                if (time.isAfter(day) && data.calendar[i]) {
                    return 'icon-info';
                } else {
                    return 'icon-info hidden';
                }
            }
        }
    }

    function renderDays() {
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
                const calendarDay = calendar[i].days[j];
                // Map data to calendar day
                for (let k = 0; k < data.calendar.length; k++) {
                    const storeData = data.calendar[k];

                    if (
                        storeData.day.date() === calendarDay.date() &&
                        storeData.day.month() === calendarDay.month() &&
                        storeData.day.year() === calendarDay.year()
                    ) {
                        calendar[i].data[j] = data.calendar[k];
                    }
                }

                calendarDays.push(
                    <div
                        className={handleDayClass(calendar[i].days[j])}
                        key={`${calendar[i].days[j].date()}-${calendar[i].days[j].get(
                            'month'
                        )}-${Math.random()}`}
                    >
                        <div className="number">{calendar[i].days[j].date()}</div>
                        {renderIcons(calendar[i].data[j], calendar[i].days[j])}
                        {calendar[i].data[j] && moment().isSameOrAfter(calendar[i].days[j]) ? (
                            renderDayProgressCircles(calendar[i].data[j])
                        ) : (
                            <div className="day__overview" />
                        )}
                        <a
                            onClick={() => {
                                toggleBreakdown({ active: true, day: calendar[i].days[j] });
                            }}
                        >
                            <span className={handleIconClass(calendar[i].days[j])} />
                        </a>
                    </div>
                );
            }
        }

        return calendarDays;
    }

    function changeMonth(bool) {
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

        setTime(time);
    }

    const { active, day } = dayDetails;

    return (
        <React.Fragment>
            <Fade in={true}>
                <div className="calendar">
                    <div className="calendar__toggle--month">
                        <IconButton
                            aria-label="Last Month"
                            component="div"
                            onClick={() => changeMonth(false)}
                        >
                            <i className="icon-chevron-left" />
                        </IconButton>

                        <h2>{time.format('MMMM')}</h2>
                        <IconButton
                            aria-label="Next Month"
                            component="div"
                            onClick={() => changeMonth(true)}
                        >
                            <i className="icon-chevron-right" />
                        </IconButton>
                    </div>
                    <h4>{time.format('YYYY')}</h4>
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
                            {!isEmpty(data) && !loading && renderDays()}
                        </div>
                        <Legend />
                    </div>
                </div>
            </Fade>

            <DaySummary
                open={active}
                day={day.format('MMMM Do, YYYY')}
                id={day.format('x')}
                onClose={() => toggleBreakdown({ active: false, day: moment() })}
            />
        </React.Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
