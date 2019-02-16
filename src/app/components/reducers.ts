import produce from 'immer';
import firebase from 'firebase';

interface ActionTypes {
    data: any;
    type: string;
    duration: number;
}

interface AdminState {
    data: {};
    day: {
        day: {};
        todayButton: boolean;
        formattedDay: {};
        requestedDate: boolean;
        dayRef: {};
        dayIndex: 0;
    };
    error: boolean;
    userData: firebase.UserInfo | {};
    userLoading: boolean;
    loading: boolean;
    success: boolean;
}

export function adminState(
    state: AdminState = {
        data: {},
        day: {
            day: {},
            dayIndex: 0,
            dayRef: {},
            formattedDay: {},
            requestedDate: false,
            todayButton: true
        },
        error: false,
        loading: false,
        success: false,
        userData: {},
        userLoading: true
    },
    action: ActionTypes
) {
    return produce(state, nextState => {
        switch (action.type) {
            case 'LOADING_DATA':
                nextState.loading = true;
                return;

            case 'DATA_ERROR':
                nextState.loading = false;
                nextState.error = true;
                return;

            case 'RESET_ERROR':
                nextState.error = false;
                return;

            case 'RECEIVE_DATA':
                nextState.data = action.data;
                nextState.loading = false;
                nextState.success = true;
                nextState.error = false;
                return;

            case 'SAVE_USER_DATA':
                nextState.userData = action.data;
                nextState.userLoading = false;
                return;

            case 'LOGOUT':
                nextState.userData = {};
                nextState.data = {};
                return;

            case 'SAVE_DAY':
                nextState.day = action.data;
                return;
        }
    });
}

interface Queue {
    duration: number;
    key: number;
    message: string;
    type: string;
}

interface NotificationState {
    queue: Queue[];
    open: boolean;
    duration: number;
    message: string;
    type: string;
}

export function notificationState(
    state: NotificationState = {
        duration: 3000,
        message: '',
        open: false,
        queue: [],
        type: 'info'
    },
    action: ActionTypes
) {
    return produce(state, nextState => {
        let openFlag = false;
        let notif: Queue = {
            duration: 0,
            key: 0,
            message: '',
            type: 'info'
        };

        switch (action.type) {
            case 'OPEN_NOTIFICATION_SNACKBAR':
                nextState.message = action.data;
                return;

            case 'CLOSE_SNACKBAR':
                nextState.open = false;
                return;

            case 'SNACKBAR_INFO':
                nextState.queue.push({
                    duration: action.duration || 3000,
                    key: new Date().getTime(),
                    message: action.data || '[Pass some text into the 2nd param]',
                    type: 'info'
                });

                if (!state.open && nextState.queue.length > 0) {
                    notif = nextState.queue.shift();
                    openFlag = true;
                }

                nextState.message = notif.message;
                nextState.duration = notif.duration || 3000;
                nextState.type = 'info';
                nextState.open = openFlag;

                return;

            case 'SNACKBAR_SUCCESS':
                nextState.queue.push({
                    duration: action.duration || 3000,
                    key: new Date().getTime(),
                    message: action.data || 'Your changes were saved.',
                    type: 'success'
                });

                if (!state.open && nextState.queue.length > 0) {
                    notif = nextState.queue.shift();
                    openFlag = true;
                }

                nextState.message = notif.message;
                nextState.type = 'success';
                nextState.open = openFlag;
                nextState.duration = notif.duration || 3000;

                return;

            case 'SNACKBAR_WARNING':
                nextState.queue.push({
                    duration: action.duration || 3000,
                    key: new Date().getTime(),
                    message: action.data || 'Something went wrong. Please try again later.',
                    type: 'warning'
                });

                if (!state.open && nextState.queue.length > 0) {
                    notif = nextState.queue.shift();
                    openFlag = true;
                }

                nextState.message = notif.message;
                nextState.type = 'warning';
                nextState.open = openFlag;
                nextState.duration = notif.duration || 3000;

                return;

            case 'SNACKBAR_ERROR':
                nextState.queue.push({
                    duration: action.duration || 3000,
                    key: new Date().getTime(),
                    message: action.data || 'An error occurred. Please try again later.',
                    type: 'error'
                });

                if (!state.open && nextState.queue.length > 0) {
                    notif = nextState.queue.shift();
                    openFlag = true;
                }

                nextState.message = notif.message;
                nextState.duration = notif.duration || 3000;
                nextState.type = 'error';
                nextState.open = openFlag;

                return;

            case 'PROCESS_SNACKBAR_QUEUE':
                if (nextState.queue.length > 0) {
                    notif = nextState.queue.shift();
                    openFlag = true;
                }

                nextState.message = notif.message;
                nextState.type = notif.type;
                nextState.open = openFlag;
                nextState.duration = notif.duration || 3000;

                return;
        }
    });
}
