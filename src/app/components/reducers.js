export function adminState(
    state = {
        data: {},
        userData: {},
        userLoading: true,
        loading: false,
        success: null,
        error: null
    },
    action
) {
    switch (action.type) {
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

        case 'RECEIVE_DATA':
            return Object.assign({}, state, {
                data: action.data,
                loading: false,
                success: true,
                error: false
            });

        case 'SAVE_USER_DATA':
            return Object.assign({}, state, {
                userData: action.data,
                userLoading: false
            });

        case 'LOGOUT':
            return Object.assign({}, state, {
                userData: {},
                data: {}
            });

        default:
            return state || '';
    }
}

export function notificationState(
    state = {
        open: false,
        message: null,
        type: 'info',
        queue: [],
        duration: 3000
    },
    action
) {
    let newQ = Object.assign([], state.queue);
    let notif = {};
    let openFlag = false;

    switch (action.type) {
        case 'OPEN_NOTIFICATION_SNACKBAR':
            return Object.assign({}, state, {
                message: action.data
            });

        case 'CLOSE_SNACKBAR':
            return Object.assign({}, state, {
                open: false
            });

        case 'SNACKBAR_INFO':
            newQ.push({
                key: new Date().getTime(),
                message: action.data || '[Pass some text into the 2nd param]',
                duration: action.duration || 3000,
                type: 'info'
            });

            if (!state.open && newQ.length > 0) {
                notif = newQ.shift();
                openFlag = true;
            }

            return Object.assign({}, state, {
                message: notif.message,
                queue: newQ,
                type: 'info',
                open: openFlag,
                duration: action.duration || 3000
            });

        case 'SNACKBAR_SUCCESS':
            newQ.push({
                key: new Date().getTime(),
                message: action.data || 'Your changes were saved.',
                duration: action.duration || 3000,
                type: 'success'
            });

            if (!state.open && newQ.length > 0) {
                notif = newQ.shift();
                openFlag = true;
            }

            return Object.assign({}, state, {
                duration: action.duration || 3000,
                message: notif.message,
                queue: newQ,
                type: 'success',
                open: openFlag
            });

        case 'SNACKBAR_WARNING':
            newQ.push({
                key: new Date().getTime(),
                message: action.data || 'Something went wrong. Please try again later.',
                duration: action.duration || 3000,
                type: 'warning'
            });

            if (!state.open && newQ.length > 0) {
                notif = newQ.shift();
                openFlag = true;
            }

            return Object.assign({}, state, {
                duration: action.duration || 3000,
                message: notif.message,
                queue: newQ,
                type: 'warning',
                open: openFlag
            });

        case 'SNACKBAR_ERROR':
            newQ.push({
                key: new Date().getTime(),
                message: action.data || 'An error occurred. Please try again later.',
                duration: action.duration || 3000,
                type: 'error'
            });

            if (!state.open && newQ.length > 0) {
                notif = newQ.shift();
                openFlag = true;
            }

            return Object.assign({}, state, {
                duration: action.duration || 3000,
                message: notif.message,
                queue: newQ,
                type: 'error',
                open: openFlag
            });

        case 'PROCESS_SNACKBAR_QUEUE':
            if (newQ.length > 0) {
                notif = newQ.shift();
                openFlag = true;
            }

            return Object.assign({}, state, {
                queue: newQ,
                message: notif.message,
                type: notif.type,
                open: openFlag,
                duration: notif.duration || 3000
            });

        default:
            return state;
    }
}
