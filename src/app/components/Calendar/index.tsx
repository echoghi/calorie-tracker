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
import { makeCalendarDays } from './utils';

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

        if (now.isSame(dayMoment)) {
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

    function renderDays() {
        const calendarDays: React.ReactNode[] = [];
        const calendar = makeCalendarDays(state.time);

        for (const week of calendar) {
            for (let j = 0; j < week.days.length; j++) {
                const calendarDay = week.days[j];

                for (const weekData of data.calendar) {
                    // Map data to calendar day
                    if (weekData.day.isSame(calendarDay)) {
                        week.data[j] = weekData;
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

                        {[
                            // Nutrition Rings
                            week.data[j] && moment().isSameOrAfter(calendarDay) ? (
                                <NutritionRings
                                    key="nutrition-rings"
                                    day={week.data[j]}
                                    data={data}
                                    context={state.time}
                                />
                            ) : (
                                <div className="day__overview" key="empty-calendar-day" />
                            ),

                            // Day breakdown icon
                            moment().isSameOrAfter(calendarDay) && (
                                <a onClick={openBreakdown} key="day-breakdown-icon">
                                    <InfoIcon className="icon-info" />
                                </a>
                            )
                        ]}
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

                {/* Year Header */}
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
