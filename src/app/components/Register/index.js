import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Firebase from '../firebase';
import Notifications from '../Notifications';
import Input from '../Input';
import { Formik } from 'formik';
import { validateSignUp } from '../validation';
import { withRouter } from 'react-router-dom';
import { Header, Container, Form, Wrapper, ErrorMessage, BackToLogin } from '../Login/styles';
import { connect } from 'react-redux';
import { errorNotification } from '../actions';

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message))
});

const Register = ({ errorNotification, history }) => {
    async function onRegister(name, email, password) {
        try {
            await Firebase.register(name, email, password);

            history.push('/');
        } catch (err) {
            console.warn(err.message);

            errorNotification(err.message);
        }
    }

    return (
        <Container>
            <Notifications />

            <Paper elevation={3}>
                <Wrapper>
                    <Header>Create Account</Header>

                    <Formik
                        initialValues={{ name: '', email: '', password: '' }}
                        validate={values => {
                            return validateSignUp(values);
                        }}
                        onSubmit={(values, actions) => {
                            const { name, email, password } = values;

                            onRegister(name, email, password);

                            actions.setSubmitting(false);
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit}>
                                <FormControl fullWidth>
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

                                <FormControl fullWidth margin="normal">
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

                                <FormControl fullWidth margin="normal">
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

                                <FormControl fullWidth margin="normal">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="raised"
                                        disabled={isSubmitting}
                                    >
                                        Sign Up
                                    </Button>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
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
