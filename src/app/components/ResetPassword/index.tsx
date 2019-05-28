import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Firebase from '../firebase';
import Notifications from '../Notifications';
import Input from '../Inputs/Input';
import { Formik, FormikActions } from 'formik';
import { validateResetPassword, ResetPasswordValues } from '../validation';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
    Header,
    Container,
    Form,
    Wrapper,
    ErrorMessage,
    BackToLogin,
    SubHeader
} from '../Login/styles';
import { connect } from 'react-redux';
import { errorNotification } from '../actions';

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message)
};

interface ResetPassword extends RouteComponentProps {
    errorMessage: (message?: string) => void;
}

const ResetPassword = ({ errorMessage }: ResetPassword) => {
    const [submitted, toggleSubmitted] = useState(false);
    async function onRequest(email: string) {
        try {
            await Firebase.resetPasswordRequest(email);
        } catch (err) {
            console.warn(err.message);

            errorMessage(err.message);
        }
    }

    const submitHandler = (
        values: ResetPasswordValues,
        actions: FormikActions<ResetPasswordValues>
    ) => {
        onRequest(values.email);
        toggleSubmitted(true);
        actions.setSubmitting(false);
    };

    return (
        <Container>
            <Notifications />

            <Paper elevation={3}>
                <Wrapper>
                    <Header>{submitted ? 'Email Sent' : 'Reset Password'}</Header>
                    {/* prettier-ignore */}
                    <SubHeader>
                        {submitted
                            ? 'We\'ve e-mailed you instructions for setting your password to the e-mail address you submitted. You should be receiving it shortly.'
                            : 'Please specify your email address to receive instructions for resetting it. If an account exists by that email, we will send a password reset.'}
                    </SubHeader>
                    <Formik
                        initialValues={{ email: '' }}
                        validate={validateResetPassword}
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
                            <Fade in={true}>
                                <Form onSubmit={handleSubmit} noValidate={true}>
                                    <FormControl fullWidth={true} margin="normal">
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
                                        <Button
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            disabled={isSubmitting}
                                        >
                                            Reset Password
                                        </Button>
                                    </FormControl>

                                    <FormControl fullWidth={true} margin="normal">
                                        <BackToLogin to="/login">Back to Log In</BackToLogin>
                                    </FormControl>
                                </Form>
                            </Fade>
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
    )(ResetPassword)
);
