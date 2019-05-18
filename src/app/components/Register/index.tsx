import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Firebase from '../firebase';
import Notifications from '../Notifications';
import Input from '../Input';
import { Formik, FormikActions } from 'formik';
import { validateSignUp, SignUpValues } from '../validation';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Header, Container, Form, Wrapper, ErrorMessage, BackToLogin } from '../Login/styles';
import { connect } from 'react-redux';
import { errorNotification } from '../actions';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message))
});

interface Register extends RouteComponentProps {
    errorMessage: (message?: string) => void;
}

const Register = ({ errorMessage, history }: Register) => {
    async function onRegister(name: string, email: string, password: string) {
        try {
            await Firebase.register(name, email, password);

            history.push('/');
        } catch (err) {
            console.warn(err.message);

            errorMessage(err.message);
        }
    }

    const submitHandler = (values: SignUpValues, actions: FormikActions<SignUpValues>) => {
        const { name, email, password } = values;

        onRegister(name, email, password);

        actions.setSubmitting(false);
    };

    return (
        <Container>
            <Notifications />

            <Paper elevation={3}>
                <Wrapper>
                    <Header>Create Account</Header>

                    <Formik
                        initialValues={{ name: '', email: '', password: '' }}
                        validate={validateSignUp}
                        onSubmit={submitHandler}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit} noValidate={true}>
                                <FormControl fullWidth={true}>
                                    <Input
                                        name="name"
                                        label="Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        error={errors.name && touched.name}
                                    />
                                    <ErrorMessage>
                                        {errors.name && touched.name && errors.name}
                                    </ErrorMessage>
                                </FormControl>

                                <FormControl fullWidth={true} margin="normal">
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
                                        onChange={handleChange}
                                        error={errors.password && touched.password}
                                    />
                                    <ErrorMessage>
                                        {errors.password && touched.password && errors.password}
                                    </ErrorMessage>
                                </FormControl>

                                <FormControl fullWidth={true} margin="normal">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="raised"
                                        disabled={isSubmitting}
                                    >
                                        Sign Up
                                    </Button>
                                </FormControl>

                                <FormControl fullWidth={true} margin="normal">
                                    <BackToLogin to="/login">Back to Log In</BackToLogin>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                </Wrapper>
            </Paper>
        </Container>
    );
};

export default withRouter(
    connect(
        null,
        mapDispatchToProps
    )(Register)
);