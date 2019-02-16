declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.svg';
declare module 'the-platform';
declare module 'lodash.isempty';
declare module 'react-lottie';
declare module 'query-string';

declare var NODE_ENV: string;
declare var GA_ID: string;

import moment from 'moment';

declare module Types {
    export interface RootState {
        readonly adminState: {
            data: any;
            day: {
                day: any;
                todayButton: boolean;
                formattedDay: moment.Moment;
                requestedDate: boolean;
                dayRef: any;
                dayIndex: number;
            };
            error: boolean;
            userData: any;
            userLoading: boolean;
            loading: boolean;
            success: boolean;
        };
        readonly notificationState: {
            open: boolean;
            message: boolean | string;
            type: string;
            queue: any[];
            duration: number;
        };
    }

    export interface RootActions {
        fetchData: (id: string) => void;
    }

    export interface Note {
        title: string;
        time: string;
        body: string;
        edited: boolean;
    }

    export interface Day {
        nutrition: {
            fat: number;
            calories: number;
            carbs: number;
            protein: number;
        };
        day: moment.Moment;
        notes?: Note[];
        fitness?: {
            calories: number;
            activities: string[];
        };
    }

    export interface CalendarDay {
        week: number;
        days: moment.Moment[];
        data: Day[];
        [index: number]: any;
    }

    export interface Calendar {
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
}
