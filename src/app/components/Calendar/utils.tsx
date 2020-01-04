import moment from 'moment';
import queryString from 'query-string';
import { Day } from '../types';

interface Calendar {
    data: Day[];
    days: moment.Moment[];
    week: number;
    [index: number]: any;
}

function makeCalendarDays(time: moment.Moment) {
    let calendar: Calendar[] = [];
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
    }

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

    return calendar;
}

function parseUrlDay() {
    if (location.search) {
        const parsed = queryString.parse(location.search);

        return moment(parseInt(parsed.d, 10));
    } else {
        return moment();
    }
}

export { makeCalendarDays, parseUrlDay };
