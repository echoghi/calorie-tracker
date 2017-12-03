import { userData } from './nutritionData';
import moment from 'moment';
// Cpnvert days to moment objects
for(let i = 0; i < userData.calendar.length; i++) {
    let { year, date, month } = userData.calendar[i].day;
    userData.calendar[i].day = moment([year, month, date]);
}
console.log(userData);
export function navigationState(
    state = {
        home: false,
        nutrition: false,
        activity: false,
        calendar: false,
        settings: false
    },
    action
) {
    switch (action.type) {
        case 'NAVIGATE':
            let temp = Object.assign({}, state, {
                    home: false,
                    nutrition: false,
                    activity: false,
                    calendar: false,
                    settings: false
                });

            return Object.assign({}, temp, {
                [action.data]: true
            });

        case 'ACTIVATE_PAGE':
            let temp2 = Object.assign({}, state, {
                    home: false,
                    nutrition: false,
                    activity: false,
                    calendar: false,
                    settings: false
                });

            return Object.assign({}, temp2, {
                [action.data]: true
            });

        default:
            return state || '';
    }
}

export function adminState(
    state = {
        data: userData,
        activeDay: {},
        loading: false,
        success: null,
        error: null
    },
    action
) {
    switch (action.type) {

        case 'LOAD_NUTRITION_DATA':
            return Object.assign({}, state, {
                activeDay: action.data
            });

        case 'RESET_NUTRITION_DATA':
            return Object.assign({}, state, {
                activeDay: {}
            });

        case 'LOADING_DATA':
            return Object.assign({}, state, {
                loading: true
            });

        case 'DATA_ERROR':
            return Object.assign({}, state, {
                loading: false,
                error: true
            });

        case 'RESET_ERROR':
            return Object.assign({}, state, {
                error: false
            });

        case 'RESET_FORM':
            return Object.assign({}, state, {
                error: null,
                success: null
            });

        case 'RECEIVE_DATA':
            return Object.assign({}, state, {
                data: action.data,
                loading: false,
                success: true,
                error: false
            });

        case 'FORM_SUCCESS':
            return Object.assign({}, state, {
                loading: false,
                success: true
            });
        case 'FORM_ERROR':
            return Object.assign({}, state, {
                loading: false,
                error: true
            });

        default:
            return state || '';
    }
}
