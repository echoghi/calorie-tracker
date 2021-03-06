import moment from 'moment';
import { Dispatch } from 'redux';
import firebase from 'firebase';

import Firebase from './firebase';
import { Meal } from './types';

const usersRef = Firebase.db.ref('users');

export const loadData = (id: string) => {
    return (dispatch: Dispatch<any>) => {
        usersRef.child(id).on('value', snapshot => {
            const user = snapshot.val();

            for (const dayObj of user.calendar) {
                const { year, date, month } = dayObj.day;
                dayObj.day = moment([year, month, date]);
            }
            console.warn('DATA UPDATE', user);
            dispatch(receiveData(user));
        });
    };
};

export function receiveData<T>(data: T) {
    return {
        data,
        type: 'RECEIVE_DATA'
    };
}

export function loadingData() {
    return {
        type: 'LOADING_DATA'
    };
}

export function copyMeal(data: Meal) {
    return {
        data,
        type: 'COPY_MEAL'
    };
}

export function clearMeal() {
    return {
        type: 'CLEAR_MEAL'
    };
}

export function closeSnackBar() {
    return {
        type: 'CLOSE_SNACKBAR'
    };
}

export function warningNotification(data?: string) {
    return {
        data,
        type: 'SNACKBAR_WARNING'
    };
}

export function successNotification(data?: string) {
    return {
        data,
        type: 'SNACKBAR_SUCCESS'
    };
}

export function errorNotification(data?: string, duration?: number) {
    return {
        data,
        duration,
        type: 'SNACKBAR_ERROR'
    };
}

export function processQueue() {
    return {
        type: 'PROCESS_SNACKBAR_QUEUE'
    };
}

export function dataError() {
    return {
        type: 'DATA_ERROR'
    };
}

export function resetError() {
    return {
        type: 'RESET_ERROR'
    };
}

export function saveUserData(data: firebase.UserInfo) {
    return {
        data,
        type: 'SAVE_USER_DATA'
    };
}

export function logOut() {
    return {
        type: 'LOGOUT'
    };
}

export function saveDay(data: string) {
    return {
        data,
        type: 'SAVE_DAY'
    };
}

interface UsersRef {
    users?: {
        [index: string]: any;
    };
    [index: string]: any;
}

export function createUser(id: string) {
    return (dispatch: Dispatch<any>): any => {
        const newUser: UsersRef = {};
        const now = moment();

        console.warn('new user created', id, now);

        newUser[`users/${id}`] = {
            calendar: [
                {
                    day: {
                        date: now.date(),
                        month: now.get('month'),
                        year: now.get('year')
                    },
                    nutrition: {
                        calories: 0,
                        carbs: 0,
                        fat: 0,
                        protein: 0
                    }
                }
            ],
            user: {
                age: 21,
                gender: 'Male',
                goals: {
                    calories: 2000,
                    carbs: 100,
                    fat: 100,
                    protein: 100
                },
                height: 70,
                newAccount: true,
                weight: 150
            }
        };

        // Save new entries to firebase and reload them into the app
        Firebase.db.ref().update(newUser, () => dispatch(loadData(id)));
    };
}

export function fetchData(id: string) {
    return (dispatch: Dispatch<any>): any => {
        dispatch(loadingData());

        usersRef.child(id).once('value', snapshot => {
            const user = snapshot.val();
            let lastDay;

            if (user) {
                // Convert days to moment objects
                for (const calendarDay of user.calendar) {
                    const { year, date, month } = calendarDay.day;
                    calendarDay.day = moment([year, month, date]);
                    lastDay = calendarDay.day;
                }

                // If the calendar entries are not caught up to today,
                // create the missing entries
                if (moment().isAfter(lastDay)) {
                    const daysToAdd = moment().diff(lastDay, 'days');
                    let dayKey = user.calendar.length;
                    const update: UsersRef = {};

                    for (let i = 0; i < daysToAdd; i++) {
                        lastDay.add(1, 'd');

                        update[`users/${id}/calendar/${dayKey}`] = {
                            day: {
                                date: lastDay.date(),
                                month: lastDay.get('month'),
                                year: lastDay.get('year')
                            },
                            nutrition: {
                                calories: 0,
                                carbs: 0,
                                fat: 0,
                                protein: 0
                            }
                        };

                        dayKey++;
                    }

                    // Save new entries to firebase and reload them into the app
                    Firebase.db.ref().update(update, () => {
                        dispatch(loadData(id));
                    });
                } else {
                    dispatch(loadData(id));
                }
            } else {
                dispatch(createUser(id));
            }
        });
    };
}
