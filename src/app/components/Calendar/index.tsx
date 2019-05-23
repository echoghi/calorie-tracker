import React, { Fragment, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import isEmpty from 'lodash.isempty';
import DayDialog from './DayDialog';
import DaySummary from './DaySummary';
import Legend from './Legend';
import NutritionRings from './NutritionRings';
import {
    Icon,
    Day as DayContainer,
    ToggleMonth,
    Wrapper,
    CalendarWrapper,
    CalendarContainer,
    YearHeader,
    CalendarHeader,
    DayNumber,
    InfoIcon
} from './styles';
import { Day, RootState, DefaultAction } from '../types';
import ReactTooltip from 'react-tooltip';

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

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

const calendarState = {
    dayDetails: {
        active: false,
        day: false
    },
    summary: { active: false, day: false },
    time: moment()
};

interface CalendarState {
    dayDetails: {
        active: boolean;
        day: any;
    };
    summary: { active: boolean; day: any };
    time: moment.Moment;
}

function reducer(state: CalendarState, action: DefaultAction) {
    switch (action.type) {
        case 'SET_TIME':
            return { ...state, time: action.data };
        case 'SET_BREAKDOWN_STATUS':
            return { ...state, dayDetails: action.data };

        case 'SET_SUMMARY':
            return { ...state, summary: action.data };
        default:
            return state;
    }
}

const Calendar = ({ data, loading }: Calendar) => {
    const [state, dispatch] = useReducer(reducer, calendarState);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleDayProps(dayMoment: moment.Moment) {
        const now = moment();

        if (
            now.date() === dayMoment.date() &&
            now.month() === dayMoment.month() &&
            now.year() === dayMoment.year()
        ) {
            if (dayMoment.month() !== state.time.month()) {
                return { today: true, inactive: true };
            } else {
                return { today: true, inactive: false };
            }
        } else if (dayMoment.month() !== state.time.month()) {
            return { today: false, inactive: true };
        } else {
            return { today: false, inactive: false };
        }
    }

    // Calendary Day Icons
    function DayIcons({ dayData, tooltipDay }: { dayData: Day; tooltipDay: moment.Moment }) {
        if (!dayData || tooltipDay.month() !== state.time.month() || !dayData.notes) {
            return null;
        }

        const text =
            dayData.notes.length === 1
                ? 'You recorded a note'
                : `You recorded ${dayData.notes.length} notes`;

        return (
            <Fragment>
                <ReactTooltip effect="solid">{text}</ReactTooltip>
                <Icon className="notes" data-tip={`${tooltipDay.utc}`} />
            </Fragment>
        );
    }

    // Day Breakdown Icon
    function DayBreakdownIcon({ dayMoment }: { dayMoment: moment.Moment }) {
        for (const calendarDay of data.calendar) {
            if (
                calendarDay.day.date() === dayMoment.date() &&
                calendarDay.day.month() === dayMoment.month() &&
                calendarDay.day.year() === dayMoment.year()
            ) {
                if (moment().isSameOrAfter(dayMoment) && calendarDay) {
                    return <InfoIcon className="icon-info" />;
                }
            }
        }

        return null;
    }

    function renderDays() {
        const calendarDays: React.ReactNode[] = [];
        let calendar: CalendarDay[] = [];
        const startWeek = state.time
            .clone()
            .startOf('month')
            .week();
        const endWeek = state.time
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
                            state.time
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
                            state.time
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
                            state.time
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
                            state.time
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
                            state.time
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
                            state.time
                                .week(week)
                                .startOf('week')
                                .clone()
                                .add(n + i, 'day')
                        ),
                    week
                });
            }
        }

        for (const week of calendar) {
            for (let j = 0; j < week.days.length; j++) {
                const calendarDay = week.days[j];
                // Map data to calendar day
                for (const weekData of data.calendar) {
                    const storeData = weekData;

                    if (
                        storeData.day.date() === calendarDay.date() &&
                        storeData.day.month() === calendarDay.month() &&
                        storeData.day.year() === calendarDay.year()
                    ) {
                        week.data[j] = storeData;
                    }
                }

                const openBreakdown = () => {
                    dispatch({
                        data: {
                            active: true,
                            day: week.data[j]
                        },
                        type: 'SET_BREAKDOWN_STATUS'
                    });
                };

                calendarDays.push(
                    <DayContainer
                        {...handleDayProps(calendarDay)}
                        key={`${calendarDay.date()}-${calendarDay.get('month')}-${Math.random()}`}
                    >
                        <DayNumber>{calendarDay.date()}</DayNumber>
                        <DayIcons dayData={week.data[j]} tooltipDay={calendarDay} />

                        {week.data[j] && moment().isSameOrAfter(calendarDay) ? (
                            <NutritionRings day={week.data[j]} data={data} context={state.time} />
                        ) : (
                            <div className="day__overview" />
                        )}

                        <a onClick={openBreakdown}>
                            <DayBreakdownIcon dayMoment={calendarDay} />
                        </a>
                    </DayContainer>
                );
            }
        }

        return calendarDays;
    }

    function changeMonth(increment: boolean) {
        if (increment) {
            // if its December, increment the year
            if (state.time.get('month') === 11) {
                dispatch({ type: 'SET_TIME', data: moment([state.time.get('year') + 1, 0, 1]) });
            } else {
                dispatch({
                    data: moment([state.time.get('year'), state.time.get('month') + 1, 1]),
                    type: 'SET_TIME'
                });
            }
        } else {
            // if its January, decrement the year
            if (state.time.get('month') === 0) {
                dispatch({ type: 'SET_TIME', data: moment([state.time.get('year') - 1, 11, 1]) });
            } else {
                dispatch({
                    data: moment([state.time.get('year'), state.time.get('month') - 1, 1]),
                    type: 'SET_TIME'
                });
            }
        }

        dispatch({
            data: { active: false, day: moment() },
            type: 'SET_SUMMARY'
        });
    }

    const { active, day } = state.dayDetails;

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
    const closeBreakdown = () =>
        dispatch({
            data: { active: false, day: null },
            type: 'SET_BREAKDOWN_STATUS'
        });

    return (
        <Fragment>
            <Wrapper>
                <ToggleMonth>
                    <IconButton aria-label="Last Month" component="div" onClick={lastMonth}>
                        <i className="icon-chevron-left" />
                    </IconButton>

                    <h2>{state.time.format('MMMM')}</h2>
                    <IconButton aria-label="Next Month" component="div" onClick={nextMonth}>
                        <i className="icon-chevron-right" />
                    </IconButton>
                </ToggleMonth>

                {/* Desktop Year Header */}
                <YearHeader>{state.time.format('YYYY')}</YearHeader>
                <CalendarWrapper>
                    <CalendarContainer>
                        <Header />
                        {!isEmpty(data) && !loading && renderDays()}
                    </CalendarContainer>
                    <Legend />
                </CalendarWrapper>

                {/* Day Summary Modal */}
                {state.summary.active && <DaySummary day={state.summary.day} />}
            </Wrapper>

            <DayDialog open={active} day={day} onClose={closeBreakdown} />
        </Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
