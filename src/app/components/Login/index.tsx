import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import Input from '../Input';
import Notifications from '../Notifications';
import { RouteComponentProps } from 'react-router-dom';
import { saveUserData, fetchData, errorNotification } from '../actions';
import isEmpty from 'lodash.isempty';
import {
    Header,
    Wrapper,
    Container,
    Form,
    ErrorMessage,
    SignUpLink,
    SignUpText,
    SignUp
} from './styles';
import { validateLogIn } from '../validation';
import Firebase from '../firebase.js';

const mapStateToProps = (state: any) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: any) => ({
    getUser: (id: number) => dispatch(fetchData(id)),
    saveUser: (data: string) => dispatch(saveUserData(data)),
    showError: (message: string) => dispatch(errorNotification(message))
});

interface LoginProps extends RouteComponentProps {
    saveUser: (data: string) => void;
    userData: {
        uid: number;
    };
    getUser: (id: number) => void;
    showError: (message: string) => void;
}

const validationConfig = (values: { email: string; password: string }) => {
    return validateLogIn(values);
};

const Login = ({ saveUser, history, userData, getUser, showError }: LoginProps) => {
    // unmount
    React.useEffect(() => {
        return () => {
            if (!isEmpty(userData)) {
                getUser(userData.uid);
            }
        };
    }, []);

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

            showError(message);
        }
    }

    const formHandler = (
        values: { email: string; password: string },
        actions: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        const { email, password } = values;

        logIn(email, password);

        actions.setSubmitting(false);
    };

    function logInGoogle() {
        try {
            Firebase.logInWithGoogle().then(result => {
                const user = result.user;

                if (user) {
                    saveUser(user);
                    history.push('/');
                }
            });
        } catch (err) {
            console.warn(err);
        }
    }

    return (
        <Container>
            <Notifications />

            <Paper elevation={3}>
                <Wrapper>
                    <Header>Doughboy</Header>

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
                                <Form onSubmit={handleSubmit}>
                                    <FormControl fullWidth={true}>
                                        <Input
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
                                            Log In
                                        </Button>
                                    </FormControl>

                                    <FormControl fullWidth={true} margin="normal">
                                        <Button
                                            onClick={logInGoogle}
                                            color="primary"
                                            variant="outlined"
                                        >
                                            Login via Google
                                        </Button>
                                    </FormControl>

                                    <SignUp>
                                        <SignUpText>New User?</SignUpText>
                                        <SignUpLink to="/register">Sign Up</SignUpLink>
                                    </SignUp>
                                </Form>
                            </Fade>
                        )}
                    </Formik>
                </Wrapper>
            </Paper>
        </Container>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);