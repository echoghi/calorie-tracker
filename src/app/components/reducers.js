export function adminState(
    state = {
        data: {},
        userData: {},
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
                userData: action.data
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
