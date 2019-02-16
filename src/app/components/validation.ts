type DefaultValidator = 'Required' | false;

export interface NoteValues {
    title: string;
    body: string;
}

export interface MealValues {
    calories: string;
    carbs: string;
    fat: string;
    name: string;
    protein: string;
    servings: string;
}

export interface NoteValidator {
    title: DefaultValidator;
    body: DefaultValidator;
}

export interface MealValidator {
    name: DefaultValidator;
    servings: DefaultValidator;
}

export interface LogInValues {
    email: string;
    password: string;
}

export interface LogInValidator {
    email: 'Required' | 'Invalid email address' | false;
    password: 'Required' | 'Password must be at least 6 characters long.' | false;
}

export interface SignUpValues {
    name: string;
    email: string;
    password: string;
}

export interface SignUpValidator {
    name: DefaultValidator;
    email: 'Required' | 'Invalid email address' | false;
    password: 'Required' | 'Password must be at least 6 characters long.' | false;
}

export function defaultValidator(name: string) {
    if (!name) {
        return 'Required';
    } else {
        return false;
    }
}

export function defaultNumberValidator(name: number) {
    if (name === 0) {
        return 'Required';
    } else {
        return false;
    }
}

// log in / sign up
export function validateEmail(email: string) {
    if (!email) {
        return 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        return 'Invalid email address';
    } else {
        return false;
    }
}

export function validatePassword(pass: string) {
    if (!pass) {
        return 'Required';
    } else if (pass.length < 6) {
        return 'Password must be at least 6 characters long.';
    } else {
        return false;
    }
}

export function validateLogIn(values: LogInValues): LogInValidator | {} {
    if (validateEmail(values.email) || validatePassword(values.password)) {
        return {
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    } else {
        return {};
    }
}

export function validateSignUp(values: SignUpValues): SignUpValidator | {} {
    if (
        defaultValidator(values.name) ||
        validateEmail(values.email) ||
        validatePassword(values.password)
    ) {
        return {
            email: validateEmail(values.email),
            name: defaultValidator(values.name),
            password: validatePassword(values.password)
        };
    } else {
        return {};
    }
}

// nutrition
export function validateMeal(values: MealValues): MealValidator | {} {
    if (defaultValidator(values.name) || defaultNumberValidator(+values.servings)) {
        return {
            name: defaultValidator(values.name),
            servings: defaultNumberValidator(+values.servings)
        };
    } else {
        return {};
    }
}

export function validateNote(values: NoteValues): NoteValidator | {} {
    if (defaultValidator(values.title) || defaultValidator(values.body)) {
        return {
            body: defaultValidator(values.body),
            title: defaultValidator(values.title)
        };
    } else {
        return {};
    }
}

// Account Info
export interface InfoValues {
    age: number;
    gender: string;
    height: number;
    weight: number;
}

export interface InfoValidator {
    age: DefaultValidator;
    gender: DefaultValidator;
    height: DefaultValidator;
    weight: DefaultValidator;
}

export function validateAccountInfo(values: InfoValues): InfoValidator | {} {
    if (
        defaultNumberValidator(+values.age) ||
        defaultValidator(values.gender) ||
        defaultNumberValidator(+values.height) ||
        defaultNumberValidator(+values.weight)
    ) {
        return {
            gender: defaultValidator(values.gender),
            age: defaultNumberValidator(+values.age),
            height: defaultNumberValidator(+values.height),
            weight: defaultNumberValidator(+values.weight)
        };
    } else {
        return {};
    }
}

// Goals Info
export interface GoalsValues {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
}

export interface GoalsValidator {
    calories: DefaultValidator;
    carbs: DefaultValidator;
    fat: DefaultValidator;
    protein: DefaultValidator;
}

export function validateGoalsInfo(values: GoalsValues): GoalsValidator | {} {
    if (
        defaultNumberValidator(values.calories) ||
        defaultNumberValidator(values.carbs) ||
        defaultNumberValidator(values.fat) ||
        defaultNumberValidator(values.protein)
    ) {
        return {
            gender: defaultNumberValidator(values.calories),
            age: defaultNumberValidator(values.carbs),
            height: defaultNumberValidator(values.fat),
            weight: defaultNumberValidator(values.protein)
        };
    } else {
        return {};
    }
}

// General Info
export interface GeneralInfoValues {
    name: string;
}

export interface GeneralInfoValidator {
    name: DefaultValidator;
}

export function validateGeneralInfo(values: GeneralInfoValues): GeneralInfoValidator | {} {
    if (defaultValidator(values.name)) {
        return {
            name: defaultValidator(values.name)
        };
    } else {
        return {};
    }
}
