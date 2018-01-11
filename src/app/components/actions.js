import { hashHistory } from 'react-router';
export const LOAD_NUTRITION_DATA = 'LOAD_NUTRITION_DATA';
export const RESET_NUTRITION_DATA = 'RESET_NUTRITION_DATA';
export const LOADING_DATA = 'LOADING_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const DATA_ERROR = 'DATA_ERROR';
export const RESET_ERROR = 'RESET_ERROR';
export const RESET_FORM = 'RESET_FORM';
export const FORM_SUCCESS = 'FORM_SUCCESS';
export const FORM_ERROR = 'FORM_ERROR';
export const ACTIVATE_PAGE = 'ACTIVATE_PAGE';
export const SAVE_USER_DATA = 'SAVE_USER_DATA';
import firebase from './firebase.js';
import moment from 'moment';

const usersRef = firebase.database().ref('users');

export function reloadData() {
    let userData;

    return dispatch => {
        usersRef.on('value', snapshot => {
            userData = snapshot.val();

            for (let user in userData) {
                user = userData[user];

                for (let i = 0; i < user.calendar.length; i++) {
                    let { year, date, month } = user.calendar[i].day;
                    user.calendar[i].day = moment([year, month, date]);
                }

                console.log('Data update loaded:', user);
                dispatch(receiveData(user));
            }
        });
    };
}

export function loadNutritionData(data) {
    return {
        type: LOAD_NUTRITION_DATA,
        data
    };
}

export function resetNutritionData() {
    return {
        type: RESET_NUTRITION_DATA
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

export function resetForm() {
    return {
        type: RESET_FORM
    };
}

export function formSuccess() {
    return {
        type: FORM_SUCCESS
    };
}

export function formError() {
    return {
        type: FORM_ERROR
    };
}

export function activatePage(page) {
    return {
        type: ACTIVATE_PAGE,
        data: page
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
        const usersRef = firebase.database().ref('users');
        let userData;

        usersRef.once('value', snapshot => {
            userData = snapshot.val();

            // Convert days to moment objects
            for (let user in userData) {
                user = userData[user];
                let lastDay;

                for (let i = 0; i < user.calendar.length; i++) {
                    let { year, date, month } = user.calendar[i].day;
                    user.calendar[i].day = moment([year, month, date]);
                    lastDay = user.calendar[i].day;
                }

                // If the calendar entries are not caught up to today, create the missing entries
                if (
                    moment([
                        moment().get('year'),
                        moment().get('month'),
                        moment().date()
                    ]).isAfter(lastDay)
                ) {
                    let update = {};
                    let dayKey = user.calendar.length;
                    let daysToAdd = moment().diff(lastDay, 'days');

                    for (let i = 0; i < daysToAdd; i++) {
                        lastDay.add(1, 'd');

                        update[
                            `users/-L1W7yroxzFV-EPpK63D/calendar/${dayKey}`
                        ] = {
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
                        firebase.database().ref().update(update, () => {
                            dispatch(reloadData());
                        });

                        dayKey++;
                    }
                } else {
                    console.log('User Data Pulled:', user);

                    dispatch(receiveData(user));
                }
            }
        });
    };
}

export function handleNav(page) {
    // Route to...
    if (page === 'home') {
        hashHistory.push('/');
    } else {
        hashHistory.push(`/${page}`);
    }

    return {
        type: 'NAVIGATE',
        data: page
    };
}

export function postForm(data) {
    return dispatch => {
        dispatch(loadingData());
        return fetch('/api/postForm', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch(formSuccess());
                    setTimeout(function() {
                        dispatch(resetForm());
                    }, 3000);
                } else {
                    dispatch(formError());
                }
            })
            .catch(error => {
                dispatch(formError());
                throw error;
            });
    };
}
