import React from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { errorNotification, successNotification, saveUserData } from '../actions';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import { FormikActions, Formik } from 'formik';
import Input from '../Input';
import { SettingsHeader, SettingsSubHeader, SettingsSection } from './styles';
import { RootState } from '../types';
import { Dispatch } from 'redux';
import firebase from 'firebase';
import { GeneralInfoValues, validateGeneralInfo } from '../validation';

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    saveUser: (userData: firebase.UserInfo) => dispatch(saveUserData(userData)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

interface GeneralInfo {
    errorMessage: (message?: string) => void;
    saveUser: (userData: firebase.UserInfo) => void;
    successMessage: (message?: string) => void;
    userData: firebase.UserInfo;
}

const GeneralInfo = ({ userData, errorMessage, successMessage, saveUser }: GeneralInfo) => {
    const [name, setDisplayName] = React.useState('');

    React.useEffect(() => {
        if (!isEmpty(userData)) {
            setDisplayName(userData.displayName);
        }
    });

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
                        <Input
                            name="name"
                            label="Display Name"
                            error={errors.name && touched.name}
                            onChange={handleChange}
                            value={values.name}
                        />
                        <Button
                            style={{
                                display: 'inline-block',
                                margin: '0 20px',
                                verticalAlign: 'bottom'
                            }}
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Change Display Name
                        </Button>
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
