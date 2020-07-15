import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { errorNotification, successNotification, saveUserData } from '../actions';
import isEmpty from 'lodash.isempty';
import { Formik } from 'formik';
import {
    SettingsHeader,
    SettingsSubHeader,
    SettingsSection,
    FormButton,
    DisplayNameInput,
} from './styles';
import { validateGeneralInfo } from '../validation';

const mapStateToProps = (state) => ({
    userData: state.adminState.userData,
});

const mapDispatchToProps = {
    errorMessage: (message) => errorNotification(message),
    saveUser: (userData) => saveUserData(userData),
    successMessage: (message) => successNotification(message),
};

const GeneralInfo = ({ userData, errorMessage, successMessage, saveUser }) => {
    const [name, setDisplayName] = useState('');

    useEffect(() => {
        if (!isEmpty(userData)) {
            setDisplayName(userData.displayName);
        }
    }, [setDisplayName, userData]);

    const submitHandler = (values, actions) => {
        Firebase.auth.currentUser
            .updateProfile({
                displayName: values.name,
                photoURL: userData.photoURL,
            })
            .then(() => {
                successMessage('Display Name Updated.');

                // reload new display name into redux
                Firebase.auth.currentUser.reload().then(() => {
                    saveUser(Firebase.auth.currentUser);
                });

                actions.setSubmitting(false);
            })
            .catch((err) => {
                console.error(err);
                errorMessage();

                actions.setSubmitting(false);
            });
    };

    return (
        <SettingsSection>
            <SettingsHeader>General Info</SettingsHeader>
            <SettingsSubHeader>What would you like to be called?</SettingsSubHeader>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    name,
                }}
                validate={validateGeneralInfo}
                onSubmit={submitHandler}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} noValidate={true}>
                        <DisplayNameInput
                            id="name"
                            name="name"
                            label="Display Name"
                            error={errors.name && touched.name}
                            onChange={handleChange}
                            value={values.name}
                        />
                        <FormButton
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Change Display Name
                        </FormButton>
                    </form>
                )}
            </Formik>
        </SettingsSection>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfo);
