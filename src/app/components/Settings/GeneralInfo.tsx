import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { errorNotification, successNotification, saveUserData } from '../actions';
import isEmpty from 'lodash.isempty';
import { FormikActions, Formik } from 'formik';
import {
    SettingsHeader,
    SettingsSubHeader,
    SettingsSection,
    FormButton,
    DisplayNameInput
} from './styles';
import { RootState } from '../types';
import firebase from 'firebase';
import { GeneralInfoValues, validateGeneralInfo } from '../validation';

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message),
    saveUser: (userData: firebase.UserInfo) => saveUserData(userData),
    successMessage: (message?: string) => successNotification(message)
};

interface GeneralInfo {
    errorMessage: (message?: string) => void;
    saveUser: (userData: firebase.UserInfo) => void;
    successMessage: (message?: string) => void;
    userData: firebase.UserInfo;
}

const GeneralInfo = ({ userData, errorMessage, successMessage, saveUser }: GeneralInfo) => {
    const [name, setDisplayName] = useState('');

    useEffect(() => {
        if (!isEmpty(userData)) {
            setDisplayName(userData.displayName);
        }
    }, [setDisplayName, userData]);

    const submitHandler = (
        values: GeneralInfoValues,
        actions: FormikActions<GeneralInfoValues>
    ) => {
        Firebase.auth.currentUser
            .updateProfile({
                displayName: values.name,
                photoURL: userData.photoURL
            })
            .then(() => {
                successMessage('Display Name Updated.');

                // reload new display name into redux
                Firebase.auth.currentUser.reload().then(() => {
                    saveUser(Firebase.auth.currentUser);
                });

                actions.setSubmitting(false);
            })
            .catch(err => {
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
                    name
                }}
                validate={validateGeneralInfo}
                onSubmit={submitHandler}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} noValidate={true}>
                        <DisplayNameInput
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GeneralInfo);
