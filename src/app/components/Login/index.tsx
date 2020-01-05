import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Fade from '@material-ui/core/Fade';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import isEmpty from 'lodash.isempty';

import Input from '../Inputs/Input';
import Notifications from '../Notifications';
import { saveUserData, fetchData, errorNotification } from '../actions';
import {
    Header,
    Wrapper,
    Container,
    Form,
    ErrorMessage,
    SignUpLink,
    SignUpText,
    SignUp,
    Divider,
    LoginFooter
} from './styles';
import { validateLogIn, validateLinkAccount } from '../validation';
import Firebase from '../firebase';
import firebase from 'firebase';
import { RootState } from '../types';
import GoogleButton from './GoogleButton';
import FacebookButton from './FacebookButton';
import config from 'Config';

interface LoginProps extends RouteComponentProps {
    saveUser: (data: firebase.UserInfo) => void;
    userData: firebase.UserInfo;
    getUser: (id: string) => void;
    showError: (message?: string, duration?: number) => void;
}

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    getUser: (id: string) => fetchData(id),
    saveUser: (data: firebase.UserInfo) => saveUserData(data),
    showError: (message: string, duration: number) => errorNotification(message, duration)
};

const validationConfig = (values: { email: string; password: string }) => {
    return validateLogIn(values);
};

const linkValidationConfig = (values: { password: string }) => {
    return validateLinkAccount(values);
};

const Login = ({ saveUser, history, userData, getUser, showError }: LoginProps) => {
    const [authError, setAuthError] = useState(null);

    // unmount
    useEffect(() => {
        return () => {
            if (!isEmpty(userData)) {
                getUser(userData.uid);
            }
        };
    }, [getUser, userData]);

    async function logIn(email: string, password: string) {
        try {
            await Firebase.logIn(email, password);
            history.push('/');
        } catch (err) {
            console.warn(err.message);

            let message;

            switch (err.code) {
                case 'auth/wrong-password':
                    message = 'Invalid Password';
                    break;

                case 'auth/user-not-found':
                    message = 'Email not found.';
                    break;

                default:
                    message = err.message;
                    break;
            }

            showError(message, 4000);
        }
    }

    async function linkAccount(password: string) {
        try {
            const linkCredentials = authError.credential;

            // Sign in with the newly linked credential
            const currentUser = await Firebase.logIn(authError.email, password);

            // Link the OAuth Credential to original account
            currentUser.user.linkWithCredential(linkCredentials);

            // navigate home
            history.push('/');
        } catch (err) {
            console.warn(err.message);

            let message;

            switch (err.code) {
                case 'auth/wrong-password':
                    message = 'Invalid Password';
                    break;

                default:
                    message = err.message;
                    break;
            }

            showError(message);
        }
    }

    async function formHandler(
        values: { email: string; password: string },
        actions: { setSubmitting: (isSubmitting: boolean) => void }
    ) {
        const { email, password } = values;

        await logIn(email, password);

        actions.setSubmitting(false);
    }

    async function linkFormHandler(
        values: { password: string },
        actions: { setSubmitting: (isSubmitting: boolean) => void }
    ) {
        await linkAccount(values.password);

        actions.setSubmitting(false);
    }

    async function logInGoogle() {
        try {
            setAuthError(null);
            const result = await Firebase.logInWithGoogle();
            const user = result.user;

            if (user) {
                saveUser(user);
                history.push('/');
            }
        } catch (err) {
            console.warn(err.message);

            if (err.code === 'auth/web-storage-unsupported') {
                showError(
                    'Oops! This authentication method is not currently supported by this browser.',
                    6000
                );
            }
        }
    }

    async function logInFacebook() {
        try {
            setAuthError(null);
            const result = await Firebase.logInWithFacebook();
            const user = result.user;

            if (user) {
                saveUser(user);
                history.push('/');
            }
        } catch (err) {
            console.warn(err);

            if (err.code === 'auth/account-exists-with-different-credential') {
                err.message =
                    'A Doughboy account with the same email already exists. Enter your password to link them.';
                setAuthError(err);
            } else if (err.code === 'auth/web-storage-unsupported') {
                showError(
                    'Oops! This authentication method is not currently supported by this browser.',
                    6000
                );
            }
        }
    }

    return (
        <Container>
            <Notifications />

            <Wrapper>
                <Header>{config.app.name}</Header>

                {!authError ? (
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={validationConfig}
                        onSubmit={formHandler}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <Fade in={true}>
                                <Form onSubmit={handleSubmit} noValidate={true}>
                                    <FormControl fullWidth={true} margin="none">
                                        <FacebookButton onClick={logInFacebook} />
                                        <GoogleButton onClick={logInGoogle} />
                                    </FormControl>
                                    <Divider>
                                        <span>continue with email</span>
                                    </Divider>

                                    <FormControl fullWidth={true}>
                                        <Input
                                            id="email"
                                            name="email"
                                            label="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            error={errors.email && touched.email}
                                        />
                                        <ErrorMessage>
                                            {errors.email && touched.email && errors.email}
                                        </ErrorMessage>
                                    </FormControl>

                                    <FormControl fullWidth={true} margin="normal">
                                        <Input
                                            id="password"
                                            name="password"
                                            label="Password"
                                            value={values.password}
                                            type="password"
                                            error={errors.password && touched.password}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage>
                                            {errors.password && touched.password && errors.password}
                                        </ErrorMessage>
                                    </FormControl>
                                    <FormControl fullWidth={true} margin="normal">
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                        >
                                            Sign In
                                        </Button>
                                    </FormControl>
                                    <LoginFooter>
                                        <SignUp>
                                            <SignUpText>New User?</SignUpText>
                                            <SignUpLink to="/register">Sign Up</SignUpLink>
                                        </SignUp>

                                        <SignUp>
                                            <SignUpLink to="/reset-password">
                                                Forgot your password?
                                            </SignUpLink>
                                        </SignUp>
                                    </LoginFooter>
                                </Form>
                            </Fade>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        initialValues={{ password: '' }}
                        validate={linkValidationConfig}
                        onSubmit={linkFormHandler}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <Fade in={true}>
                                <Form onSubmit={handleSubmit} noValidate={true}>
                                    <FormControl fullWidth={true} margin="none">
                                        <FacebookButton onClick={logInFacebook} />
                                        <GoogleButton onClick={logInGoogle} />
                                    </FormControl>
                                    <Divider>
                                        <span>continue with password</span>
                                    </Divider>

                                    <FormControl fullWidth={true} margin="normal">
                                        <Input
                                            id="password"
                                            name="password"
                                            label="Password"
                                            value={values.password}
                                            type="password"
                                            error={errors.password && touched.password}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage>
                                            {authError.message ||
                                                (errors.password &&
                                                    touched.password &&
                                                    errors.password)}
                                        </ErrorMessage>
                                    </FormControl>
                                    <FormControl fullWidth={true} margin="normal">
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                        >
                                            Sign In
                                        </Button>
                                    </FormControl>
                                    <LoginFooter>
                                        <SignUp>
                                            <SignUpText>New User?</SignUpText>
                                            <SignUpLink to="/register">Sign Up</SignUpLink>
                                        </SignUp>

                                        <SignUp>
                                            <SignUpLink to="/reset-password">
                                                Forgot your password?
                                            </SignUpLink>
                                        </SignUp>
                                    </LoginFooter>
                                </Form>
                            </Fade>
                        )}
                    </Formik>
                )}
            </Wrapper>
        </Container>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
