import React, { Fragment, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import isEmpty from 'lodash.isempty';
import Legend from './Legend';
import NutritionRings from '../ProgressBar/NutritionRings';
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
} from './styles';
import ReactTooltip from 'react-tooltip';
import { makeCalendarDays } from './utils';
import DayMenu from './DayMenu';

const mapStateToProps = (state) => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
});

const calendarState = {
    time: moment(),
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_TIME':
            return { ...state, time: action.data };

        default:
            return state;
    }
}

const Calendar = ({ data, loading, history }) => {
    const [state, dispatch] = useReducer(reducer, calendarState);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleDayProps(week, dayIndex) {
        const result = {
            first: false,
            inactive: false,
            last: false,
            onClick: () => null,
            today: false,
        };
        const dayMoment = week[dayIndex];
        const now = moment();
        const onClick = () => history.push(`/nutrition?d=${dayMoment.format('x')}`);

        if (now.isSame(dayMoment)) {
            if (dayMoment.month() !== state.time.month()) {
                result.today = true;
                result.inactive = true;
            } else {
                result.today = true;
                result.onClick = onClick;
            }
        } else if (dayMoment.month() !== state.time.month()) {
            result.inactive = true;
        } else {
            result.onClick = onClick;
        }

        // rightmost day element
        if (dayIndex + 1 === week.length) {
            result.last = true;
        }

        // leftmost day element
        if (dayIndex === 0) {
            result.first = true;
        }

        return result;
    }

    // Calendary Day Icons
    function DayIcons({ dayData, tooltipDay }) {
        if (!dayData || tooltipDay.month() !== state.time.month() || !dayData.notes) {
            return null;
        }

        const text =
            dayData.notes.length === 1
                ? 'You recorded a note'
                : `You recorded ${dayData.notes.length} notes`;

        return (
            <Fragment>
                <ReactTooltip id={`${tooltipDay.utc()}`} effect="solid">
                    {text}
                </ReactTooltip>
                <Icon className="notes" data-tip={true} data-for={`${tooltipDay.utc()}`} />
            </Fragment>
        );
    }

    function renderDays() {
        const calendarDays = [];
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

                calendarDays.push(
                    <DayContainer {...handleDayProps(week.days, j)} key={`${calendarDay.utc()}`}>
                        <DayNumber>{calendarDay.date()}</DayNumber>
                        <DayIcons dayData={week.data[j]} tooltipDay={calendarDay} />

                        {[
                            // Nutrition Rings
                            week.data[j] && moment().isSameOrAfter(calendarDay) ? (
                                <NutritionRings
                                    key="nutrition-rings"
                                    day={week.data[j]}
                                    goals={data.user.goals}
                                />
                            ) : (
                                <div className="day__overview" key="empty-calendar-day" />
                            ),

                            // Day action menu - appears on active month only
                            week.data[j] &&
                                calendarDay.isSame(state.time, 'month') &&
                                moment().isSameOrAfter(calendarDay) && (
                                    <DayMenu day={week.data[j]} key="day-menu" />
                                ),
                        ]}
                    </DayContainer>
                );
            }
        }

        return calendarDays;
    }

    function changeMonth(increment) {
        if (increment) {
            // if its December, increment the year
            if (state.time.get('month') === 11) {
                dispatch({ type: 'SET_TIME', data: moment([state.time.get('year') + 1, 0, 1]) });
            } else {
                dispatch({
                    data: moment([state.time.get('year'), state.time.get('month') + 1, 1]),
                    type: 'SET_TIME',
                });
            }
        } else {
            // if its January, decrement the year
            if (state.time.get('month') === 0) {
                dispatch({ type: 'SET_TIME', data: moment([state.time.get('year') - 1, 11, 1]) });
            } else {
                dispatch({
                    data: moment([state.time.get('year'), state.time.get('month') - 1, 1]),
                    type: 'SET_TIME',
                });
            }
        }
    }

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
            </Wrapper>
        </Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
