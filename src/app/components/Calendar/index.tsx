import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useWindowSize } from 'the-platform';
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
import { Day } from '../types';
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

const mapStateToProps = (state: any) => ({
    data: state.adminState.data,
    loading: state.adminState.loading
});

const Calendar = ({ data, loading }: Calendar) => {
    const [time, setTime] = useState(moment());
    const [dayDetails, toggleBreakdown] = useState({
        active: false,
        day: null
    });
    const [summary, setMobileSummary] = useState({ active: false, day: null });
    const { width } = useWindowSize();

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

    // Calendary Day Icons
    function DayIcons({ dayData, tooltipDay }: { dayData: Day; tooltipDay: moment.Moment }) {
        if (width < 768 || !dayData || tooltipDay.month() !== time.month() || !dayData.notes) {
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
                    toggleBreakdown({
                        active: true,
                        day: week.data[j]
                    });
                };

                const openMobileSummary = () => {
                    if (width < 768) {
                        setMobileSummary({
                            active: true,
                            day: week.data[j]
                        });

                        window.scrollTo({
                            behavior: 'smooth',
                            top: 415
                        });
                    }
                };

                calendarDays.push(
                    <DayContainer
                        {...handleDayProps(calendarDay)}
                        key={`${calendarDay.date()}-${calendarDay.get('month')}-${Math.random()}`}
                    >
                        <DayNumber>{calendarDay.date()}</DayNumber>
                        <DayIcons dayData={week.data[j]} tooltipDay={calendarDay} />

                        {week.data[j] && moment().isSameOrAfter(calendarDay) ? (
                            <NutritionRings
                                day={week.data[j]}
                                data={data}
                                context={time}
                                onClick={openMobileSummary}
                            />
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
            if (time.get('month') === 11) {
                setTime(moment([time.get('year') + 1, 0, 1]));
            } else {
                setTime(moment([time.get('year'), time.get('month') + 1, 1]));
            }
        } else {
            // if its January, decrement the year
            if (time.get('month') === 0) {
                setTime(moment([time.get('year') - 1, 11, 1]));
            } else {
                setTime(moment([time.get('year'), time.get('month') - 1, 1]));
            }
        }

        setMobileSummary({ active: false, day: moment() });
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
    const closeBreakdown = () => toggleBreakdown({ active: false, day: null });

    return (
        <Fragment>
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

                {/* Day Summary Modal */}
                {summary.active && <DaySummary day={summary.day} />}
            </Wrapper>

            <DayDialog open={active} day={day} onClose={closeBreakdown} />
        </Fragment>
    );
};

export default connect(mapStateToProps)(Calendar);
