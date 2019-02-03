import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useWindowSize } from 'the-platform';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import isEmpty from 'lodash.isempty';
import DayDialog from './DayDialog';
import DaySummary from './DaySummary';
import Legend from './Legend';
import NutritionRings from './NutritionRings';
// Images
import runnerIcon from '../../assets/images/apple-runner.png';
import {
    Icon,
    Day,
    ToggleMonth,
    Wrapper,
    CalendarWrapper,
    CalendarContainer,
    YearHeader,
    CalendarHeader,
    DayNumber
} from './styles';

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

const Calendar = ({ data, loading }) => {
    let [time, setTime] = React.useState(moment());
    const [dayDetails, toggleBreakdown] = React.useState({ active: false, day: moment() });
    const [summary, setMobileSummary] = React.useState({ active: false, day: moment() });
    const { width } = useWindowSize();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleDayProps(day) {
        const now = moment();

        if (now.date() === day.date() && now.month() === day.month() && now.year() === day.year()) {
            if (day.month() !== time.month()) {
                return { today: true, inactive: true };
            } else {
                return { today: true, inactive: false };
            }
        } else if (day.month() !== time.month()) {
            return { today: false, inactive: true };
        } else {
            return { today: false, inactive: false };
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

    function handleIcon(day) {
        for (let i = 0; i < data.calendar.length; i++) {
            if (
                data.calendar[i].day.date() === day.date() &&
                data.calendar[i].day.month() === day.month() &&
                data.calendar[i].day.year() === day.year()
            ) {
                if (moment().isSameOrAfter(day) && data.calendar[i]) {
                    return <span className="icon-info" />;
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
                    <Day
                        {...handleDayProps(calendar[i].days[j])}
                        key={`${calendar[i].days[j].date()}-${calendar[i].days[j].get(
                            'month'
                        )}-${Math.random()}`}
                    >
                        <DayNumber>{calendar[i].days[j].date()}</DayNumber>
                        {renderIcons(calendar[i].data[j], calendar[i].days[j])}
                        {calendar[i].data[j] && moment().isSameOrAfter(calendar[i].days[j]) ? (
                            <NutritionRings
                                day={calendar[i].data[j]}
                                data={data}
                                context={time}
                                onClick={
                                    width < 768
                                        ? () =>
                                              setMobileSummary({
                                                  active: true,
                                                  day: calendar[i].data[j]
                                              })
                                        : () => {}
                                }
                            />
                        ) : (
                            <div className="day__overview" />
                        )}
                        <a
                            onClick={() => {
                                toggleBreakdown({ active: true, day: calendar[i].days[j] });
                            }}
                        >
                            {handleIcon(calendar[i].days[j])}
                        </a>
                    </Day>
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

        setMobileSummary({ active: false, day: moment() });
        setTime(time);
    }

    const { active, day } = dayDetails;

    const Header = () => (
        <CalendarHeader>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
        </CalendarHeader>
    );

    return (
        <React.Fragment>
            <Fade in={true}>
                <Wrapper>
                    <ToggleMonth>
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
                    </ToggleMonth>
                    {width >= 768 && <YearHeader>{time.format('YYYY')}</YearHeader>}
                    <CalendarWrapper>
                        <CalendarContainer>
                            <Header />
                            {!isEmpty(data) && !loading && renderDays()}
                        </CalendarContainer>
                        <Legend />
                    </CalendarWrapper>
                    {summary.active && <DaySummary day={summary.day} />}
                </Wrapper>
            </Fade>

            <DayDialog
                open={active}
                day={day.format('MMMM Do, YYYY')}
                id={day.format('x')}
                onClose={() => toggleBreakdown({ active: false, day: moment() })}
            />
        </React.Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
