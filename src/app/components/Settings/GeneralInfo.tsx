import React from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { errorNotification, successNotification } from '../actions';
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
    successMessage: (message?: string) => dispatch(successNotification(message))
});

interface GeneralInfo {
    userData: firebase.UserInfo;
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
}

const GeneralInfo = ({ userData, errorMessage, successMessage }: GeneralInfo) => {
    const [name, setDisplayName] = React.useState('');

    React.useEffect(() => {
        if (!isEmpty(userData)) {
            console.log(userData.displayName);
            setDisplayName(userData.displayName);
        }
    }, [userData]);

    const submitHandler = (
        values: GeneralInfoValues,
        actions: FormikActions<GeneralInfoValues>
    ) => {
        try {
            Firebase.auth.currentUser.updateProfile({
                displayName: values.name,
                photoURL: userData.photoURL
            });
        } catch (err) {
            console.warn(err);
            errorMessage();
        }

        successMessage('Display Name Updated.');

        actions.setSubmitting(false);
        actions.resetForm();
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
                                verticalAlign: 'bottom',
                                margin: '0 10px'
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
