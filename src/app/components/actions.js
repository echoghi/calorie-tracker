export const LOADING_DATA = 'LOADING_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const DATA_ERROR = 'DATA_ERROR';
export const RESET_ERROR = 'RESET_ERROR';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';

export const LOGOUT = 'LOGOUT';
import { database } from './firebase.js';
import moment from 'moment';

const usersRef = database.ref('users');

export function reloadData(id) {
    return dispatch => {
        usersRef.child(id).on('value', snapshot => {
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

export function logOut() {
    return {
        type: LOGOUT
    };
}

export function createUser(id) {
    return dispatch => {
        console.log('creating new user');
        let newUser = {};
        const now = moment();

        newUser[`users/${id}`] = {
            calendar: [
                {
                    day: {
                        month: now.get('month'),
                        date: now.date(),
                        year: now.get('year')
                    },
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
                }
            ],
            user: {
                newAccount: true,
                goals: {
                    calories: 2000,
                    protein: 100,
                    carbs: 100,
                    fat: 100
                },
                height: 70,
                weight: 150
            }
        };

        // Save new entries to firebase and reload them into the app
        database.ref().update(newUser, () => {
            dispatch(reloadData(id));
        });
    };
}

export function fetchData(id) {
    return dispatch => {
        dispatch(loadingData());

        usersRef.child(id).on('value', snapshot => {
            let user = snapshot.val();
            let lastDay;

            if (user) {
                // Convert days to moment objects
                for (let i = 0; i < user.calendar.length; i++) {
                    const { year, date, month } = user.calendar[i].day;
                    user.calendar[i].day = moment([year, month, date]);
                    lastDay = user.calendar[i].day;
                }

                // If the calendar entries are not caught up to today, create the missing entries
                if (moment([moment().get('year'), moment().get('month'), moment().date()]).isAfter(lastDay)) {
                    const daysToAdd = moment().diff(lastDay, 'days');
                    let dayKey = user.calendar.length;
                    let update = {};

                    for (let i = 0; i < daysToAdd; i++) {
                        lastDay.add(1, 'd');

                        update[`users/${id}/calendar/${dayKey}`] = {
                            day: {
                                month: lastDay.get('month'),
                                date: lastDay.date(),
                                year: lastDay.get('year')
                            },
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
                            dispatch(reloadData(id));
                        });

                        dayKey++;
                    }
                } else {
                    console.log('User Data Pulled:', user);
                    dispatch(receiveData(user));
                }
            } else {
                dispatch(createUser(id));
            }
        });
    };
}
