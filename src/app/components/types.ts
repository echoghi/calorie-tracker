import firebase from 'firebase';

export interface AdminState {
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

export interface Queue {
    duration: number;
    key: number;
    message: string;
    type: string;
}

export interface NotificationState {
    queue: Queue[];
    open: boolean;
    duration: number;
    message: string;
    type: string;
}

export interface RootState {
    notificationState: NotificationState;
    adminState: AdminState;
}

export interface Note {
    title: string;
    time: string;
    body: string;
    edited?: boolean;
    [index: string]: string | boolean;
}

export interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
    };
    day: any;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
}
