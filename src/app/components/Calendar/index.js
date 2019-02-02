import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useWindowSize } from 'the-platform';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import isEmpty from 'lodash.isempty';
import DaySummary from './DaySummary';
import Legend from './Legend';
import Day from './Day';
// Images
import runnerIcon from '../../assets/images/apple-runner.png';
import { Icon } from './styles';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

const Calendar = ({ data, loading }) => {
    let [time, setTime] = React.useState(moment());
    const [dayDetails, toggleBreakdown] = React.useState({ active: false, day: moment() });
    const { width } = useWindowSize();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        if (width < 768) {
            return null;
        }

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
                if (moment().isSameOrAfter(day) && data.calendar[i]) {
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
                            <Day day={calendar[i].data[j]} data={data} context={time} />
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

    function changeMonth(increment) {
        if (increment) {
            // if its December, increment the year
            if (time.get('month') === 11) {
                time = moment([time.get('year') + 1, 0, 1]);
            } else {
                time = moment([time.get('year'), time.get('month') + 1, 1]);
            }
        } else {
            // if its January, decrement the year
            if (time.get('month') === 0) {
                time = moment([time.get('year') - 1, 11, 1]);
            } else {
                time = moment([time.get('year'), time.get('month') - 1, 1]);
            }
        }

        setTime(time);
    }

    const { active, day } = dayDetails;

    const Header = () => (
        <div className="calendar__head">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
        </div>
    );

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

                        <h2>
                            {width < 768
                                ? `${time.format('MMMM')} ${time.format('YYYY')}`
                                : time.format('MMMM')}
                        </h2>
                        <IconButton
                            aria-label="Next Month"
                            component="div"
                            onClick={() => changeMonth(true)}
                        >
                            <i className="icon-chevron-right" />
                        </IconButton>
                    </div>
                    {width >= 768 && <h4>{time.format('YYYY')}</h4>}
                    <div className="calendar__wrapper">
                        <div className="calendar__container">
                            <Header />
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
