export function validateEmail(email) {
    if (!email) {
        return 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        return 'Invalid email address';
    } else {
        return false;
    }
}

export function validateName(name) {
    if (!name) {
        return 'Required';
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
        validateName(values.name) ||
        validateEmail(values.email) ||
        validatePassword(values.password)
    ) {
        return {
            email: validateEmail(values.email),
            name: validateName(values.name),
            password: validatePassword(values.password)
        };
    } else {
        return {};
    }
}
