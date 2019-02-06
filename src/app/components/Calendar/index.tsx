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
import {
    Icon,
    Day,
    ToggleMonth,
    Wrapper,
    CalendarWrapper,
    CalendarContainer,
    YearHeader,
    CalendarHeader,
    DayNumber,
    InfoIcon
} from './styles';

const mapStateToProps = (state: any) => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

interface Note {
    title: string;
    time: string;
    body: string;
    edited: boolean;
}

interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
    };
    notme: string;
    day: moment.Moment;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
}

interface CalendarDay {
    week: number;
    days: moment.Moment[];
    data: Day[];
    [index: number]: any;
}

interface Calendar {
    data: {
        user: {
            goals: {
                fat: number;
                carbs: number;
                calories: number;
                protein: number;
            };
        };
        calendar: Day[];
    };
    loading: boolean;
}

const Calendar = ({ data, loading }: Calendar) => {
    let [time, setTime] = React.useState(moment());
    const [dayDetails, toggleBreakdown] = React.useState({ active: false, day: moment() });
    const [summary, setMobileSummary] = React.useState({ active: false, day: null });
    const { width } = useWindowSize();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleDayProps(dayMoment: moment.Moment) {
        const now = moment();

        if (
            now.date() === dayMoment.date() &&
            now.month() === dayMoment.month() &&
            now.year() === dayMoment.year()
        ) {
            if (dayMoment.month() !== time.month()) {
                return { today: true, inactive: true };
            } else {
                return { today: true, inactive: false };
            }
        } else if (dayMoment.month() !== time.month()) {
            return { today: false, inactive: true };
        } else {
            return { today: false, inactive: false };
        }
    }

    function renderIcons(data: Day, tooltipDay: moment.Moment) {
        if (width < 768) {
            return null;
        }

        if (data && tooltipDay.month() === time.month() && data.notes) {
            return (
                <Tooltip
                    id="tooltip-top"
                    title={`You recorded ${data.notes.length} note(s)`}
                    placement="top"
                >
                    <Icon className="icon-feather" />
                </Tooltip>
            );
        }
    }

    function handleIcon(day: moment.Moment) {
        for (const calendarDay of data.calendar) {
            if (
                calendarDay.day.date() === day.date() &&
                calendarDay.day.month() === day.month() &&
                calendarDay.day.year() === day.year()
            ) {
                if (moment().isSameOrAfter(day) && calendarDay) {
                    return <InfoIcon className="icon-info" />;
                }
            }
        }
    }

    function renderDays() {
        const calendarDays: React.ReactNode[] = [];
        let calendar: CalendarDay[] = [];
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
                    data: [],
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(48)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week: 48
                },
                {
                    data: [],
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(49)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week: 49
                },
                {
                    data: [],
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(50)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week: 50
                },
                {
                    data: [],
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(51)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week: 51
                },
                {
                    data: [],
                    days: Array(14)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(52)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week: 52
                }
            ];
        } else {
            for (let week = startWeek; week <= endWeek; week++) {
                calendar.push({
                    data: [],
                    days: Array(7)
                        .fill(0)
                        .map((n, i) =>
                            time
                                .week(week)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week
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

                const openBreakdown = () => {
                    toggleBreakdown({ active: true, day: calendar[i].days[j] });
                };

                const openMobileSummary = () => {
                    if (width < 768) {
                        setMobileSummary({
                            active: true,
                            day: calendar[i].data[j]
                        });

                        window.scroll({
                            behavior: 'smooth',
                            top: 745
                        });
                    }
                };

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
                                onClick={openMobileSummary}
                            />
                        ) : (
                            <div className="day__overview" />
                        )}
                        <a onClick={openBreakdown}>{handleIcon(calendar[i].days[j])}</a>
                    </Day>
                );
            }
        }

        return calendarDays;
    }

    function changeMonth(increment: boolean) {
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

    const lastMonth = () => changeMonth(false);
    const nextMonth = () => changeMonth(true);
    const closeBreakdown = () => toggleBreakdown({ active: false, day: moment() });

    return (
        <React.Fragment>
            <Fade in={true}>
                <Wrapper>
                    <ToggleMonth>
                        <IconButton aria-label="Last Month" component="div" onClick={lastMonth}>
                            <i className="icon-chevron-left" />
                        </IconButton>

                        <h2>
                            {width < 768
                                ? `${time.format('MMMM')} ${time.format('YYYY')}`
                                : time.format('MMMM')}
                        </h2>
                        <IconButton aria-label="Next Month" component="div" onClick={nextMonth}>
                            <i className="icon-chevron-right" />
                        </IconButton>
                    </ToggleMonth>

                    {/* Desktop Year Header */}
                    <YearHeader>{time.format('YYYY')}</YearHeader>
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
                onClose={closeBreakdown}
            />
        </React.Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
