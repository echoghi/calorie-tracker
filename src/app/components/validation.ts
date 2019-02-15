type DefaultValidator = 'Required' | false;

interface NoteValues {
    title: string;
    body: string;
}

interface MealValues {
    calories: string;
    carbs: string;
    fat: string;
    name: string;
    protein: string;
    servings: string;
}

interface NoteValidator {
    title: DefaultValidator;
    body: DefaultValidator;
}

interface MealValidator {
    name: DefaultValidator;
    servings: DefaultValidator;
}

interface LogInValues {
    email: string;
    password: string;
}

interface LogInValidator {
    email: 'Required' | 'Invalid email address' | false;
    password: 'Required' | 'Password must be at least 6 characters long.' | false;
}

interface SignUpValues {
    name: string;
    email: string;
    password: string;
}

interface SignUpValidator {
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
export function validateServings(servings: number) {
    if (servings === 0) {
        return 'Required';
    } else {
        return false;
    }
}

export function validateMeal(values: MealValues): MealValidator | {} {
    if (defaultValidator(values.name) || validateServings(+values.servings)) {
        return {
            name: defaultValidator(values.name),
            servings: validateServings(+values.servings)
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
