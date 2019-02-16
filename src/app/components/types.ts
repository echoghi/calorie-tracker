import firebase from 'firebase';
import { RouteComponentProps } from 'react-router';

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

export interface UserData {
    user: {
        age: number;
        height: number;
        weight: number;
        gender: string;
        newAccount: boolean;
        goals: {
            fat: number;
            carbs: number;
            calories: number;
            protein: number;
        };
    };
    calendar: Day[];
}

export interface AdminState {
    data: UserData | {};
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

export interface Register extends RouteComponentProps {
    errorMessage: (message?: string) => void;
}
