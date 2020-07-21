import moment from 'moment';

export function defaultValidator(name) {
    if (!name) {
        return 'Required';
    } else {
        return false;
    }
}

export function defaultNumberValidator(name) {
    if (name === 0) {
        return 'Required';
    } else {
        return false;
    }
}

export function validateBirthday(date) {
    if (!date) {
        return 'Required';
    }

    const month = date.substring(0, 2);
    const day = date.substring(3, 5);
    const year = date.substring(6, 10);

    if (+month > 12) {
        return 'Enter a valid month';
    }

    if (+day > 31) {
        return 'Enter a valid day';
    }

    if (+year > +moment().format('YYYY')) {
        return 'Enter a valid year';
    }

    if (+year < 1900) {
        return 'Enter a valid year';
    }

    return false;
}

// log in / sign up
export function validateEmail(email) {
    if (!email) {
        return 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        return 'Invalid email address';
    } else {
        return false;
    }
}

export function validatePassword(pass) {
    if (!pass) {
        return 'Required';
    } else if (pass.length < 6) {
        return 'Password must be at least 6 characters long.';
    } else {
        return false;
    }
}

export function validateLogIn(values) {
    if (validateEmail(values.email) || validatePassword(values.password)) {
        return {
            email: validateEmail(values.email),
            password: validatePassword(values.password)
        };
    } else {
        return {};
    }
}

export function validateSignUp(values) {
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

export function validateResetPassword(values) {
    if (validateEmail(values.email)) {
        return {
            email: validateEmail(values.email)
        };
    } else {
        return {};
    }
}

export function validateLinkAccount(values) {
    if (validatePassword(values.password)) {
        return {
            password: validatePassword(values.password)
        };
    } else {
        return {};
    }
}

// nutrition
export function validateMeal(values) {
    if (
        defaultValidator(values.name) ||
        defaultNumberValidator(+values.servings)
    ) {
        return {
            name: defaultValidator(values.name),
            servings: defaultNumberValidator(+values.servings)
        };
    } else {
        return {};
    }
}

export function validateNewMeal(values) {
    if (defaultValidator(values.name) || defaultValidator(values.servingSize)) {
        return {
            name: defaultValidator(values.name),
            servings: defaultValidator(values.servingSize)
        };
    } else {
        return {};
    }
}

export function validateNote(values) {
    if (defaultValidator(values.title) || defaultValidator(values.body)) {
        return {
            body: defaultValidator(values.body),
            title: defaultValidator(values.title)
        };
    } else {
        return {};
    }
}

export function validateAccountInfo(values) {
    if (
        validateBirthday(values.dob) ||
        defaultValidator(values.gender) ||
        defaultNumberValidator(+values.height) ||
        defaultNumberValidator(+values.weight)
    ) {
        return {
            dob: validateBirthday(values.dob),
            gender: defaultValidator(values.gender),
            height: defaultNumberValidator(+values.height),
            weight: defaultNumberValidator(+values.weight)
        };
    } else {
        return {};
    }
}

export function validateGoalsInfo(values) {
    if (
        defaultNumberValidator(values.calories) ||
        defaultNumberValidator(values.carbs) ||
        defaultNumberValidator(values.fat) ||
        defaultNumberValidator(values.protein)
    ) {
        return {
            age: defaultNumberValidator(values.carbs),
            gender: defaultNumberValidator(values.calories),
            height: defaultNumberValidator(values.fat),
            weight: defaultNumberValidator(values.protein)
        };
    } else {
        return {};
    }
}

export function validateGeneralInfo(values) {
    if (defaultValidator(values.name)) {
        return {
            name: defaultValidator(values.name)
        };
    } else {
        return {};
    }
}

export function validateHabit(values) {
    if (defaultValidator(values.habit)) {
        return {
            habit: defaultValidator(values.habit)
        };
    } else {
        return {};
    }
}
