export const LOAD_NUTRITION_DATA = 'LOAD_NUTRITION_DATA';
export const LOADING_DATA = 'LOADING_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const DATA_ERROR = 'DATA_ERROR';
export const RESET_ERROR = 'RESET_ERROR';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';
import { database } from './firebase.js';
import moment from 'moment';

const usersRef = database.ref('users');

export function reloadData() {
    return dispatch => {
        usersRef.child('-L1W7yroxzFV-EPpK63D').on('value', snapshot => {
            let user = snapshot.val();

            for (let i = 0; i < user.calendar.length; i++) {
                const { year, date, month } = user.calendar[i].day;
                user.calendar[i].day = moment([year, month, date]);
            }

            console.log('Data update loaded:', user);
            dispatch(receiveData(user));
        });
    };
}

export function loadNutritionData(data) {
    return {
        type: LOAD_NUTRITION_DATA,
        data
    };
}

export function receiveData(data) {
    return {
        type: RECEIVE_DATA,
        data
    };
}

export function loadingData() {
    return {
        type: LOADING_DATA
    };
}

export function dataError() {
    return {
        type: DATA_ERROR
    };
}

export function resetError() {
    return {
        type: RESET_ERROR
    };
}

export function saveUserData(data) {
    return {
        type: SAVE_USER_DATA,
        data
    };
}

export function fetchData() {
    return dispatch => {
        dispatch(loadingData());
        const usersRef = database.ref('users');

        usersRef.child('-L1W7yroxzFV-EPpK63D').on('value', snapshot => {
            let user = snapshot.val();
            let lastDay;

            // Convert days to moment objects
            for (let i = 0; i < user.calendar.length; i++) {
                let { year, date, month } = user.calendar[i].day;
                user.calendar[i].day = moment([year, month, date]);
                lastDay = user.calendar[i].day;
            }

            // If the calendar entries are not caught up to today, create the missing entries
            if (moment([moment().get('year'), moment().get('month'), moment().date()]).isAfter(lastDay)) {
                let update = {};
                let dayKey = user.calendar.length;
                let daysToAdd = moment().diff(lastDay, 'days');

                for (let i = 0; i < daysToAdd; i++) {
                    lastDay.add(1, 'd');

                    update[`users/-L1W7yroxzFV-EPpK63D/calendar/${dayKey}`] = {
                        day: {
                            month: lastDay.get('month'),
                            date: lastDay.date(),
                            year: lastDay.get('year')
                        },
                        mood: 4,
                        nutrition: {
                            calories: 0,
                            fat: 0,
                            carbs: 0,
                            protein: 0
                        },
                        fitness: {
                            calories: 0,
                            exercise: 0,
                            stand: 0
                        }
                    };

                    // Save new entries to firebase and reload them into the app
                    database.ref().update(update, () => {
                        dispatch(reloadData());
                    });

                    dayKey++;
                }
            } else {
                console.log('User Data Pulled:', user);

                dispatch(receiveData(user));
            }
        });
    };
}
