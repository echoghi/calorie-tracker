import firebase from 'firebase';
import { RouteComponentProps } from 'react-router';

export interface Note {
    title: string;
    time: string;
    body: string;
    edited?: boolean;
    [index: string]: string | boolean;
}

export interface Meal {
    name: string;
    fat: number;
    calories: number;
    carbs: number;
    protein: number;
    servings: number;
    [index: string]: string | number;
}

export interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
        meals?: Meal[];
        [index: string]: number | Meal[];
    };
    day: any;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
        [index: string]: number | string[];
    };
    [index: string]: any;
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
            [index: string]: number;
        };
        [index: string]: any;
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

export interface ProgressProps {
    color: string;
    trailColor: string;
    [index: string]: string;
}

export interface ProgressBarConfig {
    calories: ProgressProps;
    carbs: ProgressProps;
    fat: ProgressProps;
    protein: ProgressProps;
    [index: string]: ProgressProps;
}

export interface DBMeal {
    info: {
        name: string;
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
        servingSize: string;
        [index: string]: string | number;
    };
    value: string;
    [index: string]: any;
}
