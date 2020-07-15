import React, { useState, useEffect } from 'react';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { errorNotification, successNotification } from '../actions';
import produce from 'immer';
import InputMask from 'react-input-mask';
import {
    SettingsHeader,
    SettingsSubHeader,
    SettingsSection,
    GenderSelectWrapper,
    FormButton,
    AccountInfoWrapper,
    InfoInput,
    DobInput,
} from './styles';
import isEmpty from 'lodash.isempty';
import { validateAccountInfo } from '../validation';
import { Formik } from 'formik';
import Select from '../Inputs/Select';

const mapStateToProps = (state) => ({
    data: state.adminState.data,
    userData: state.adminState.userData,
});

const mapDispatchToProps = {
    errorMessage: (message) => errorNotification(message),
    successMessage: (message) => successNotification(message),
};

const AccountInfo = ({ data, userData, errorMessage, successMessage }) => {
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('Male');
    const [height, setHeight] = useState(70);
    const [weight, setWeight] = useState(150);

    useEffect(() => {
        if (!isEmpty(data)) {
            setDob(data.user.dob);
            setHeight(data.user.height);
            setWeight(data.user.weight);
            setGender(data.user.gender || 'Male');
        }
    }, [data]);

    const submitHandler = (values, actions) => {
        let user = {
            dob: '',
            gender: '',
            height: 0,
            weight: 0,
        };

        const queryRef = Firebase.db.ref('users').child(userData.uid).child('user');

        queryRef.once('value', (snapshot) => {
            user = snapshot.val();
        });

        const payload = produce(user, (updatedUser) => {
            updatedUser.dob = values.dob;
            updatedUser.gender = values.gender;
            updatedUser.height = +values.height;
            updatedUser.weight = +values.weight;
        });

        // update user's account info
        queryRef.update(payload, (error) => {
            if (error) {
                errorMessage();

                actions.setSubmitting(false);
            } else {
                successMessage('Account Info Updated.');

                actions.setSubmitting(false);
                actions.resetForm();
            }
        });
    };

    return (
        <SettingsSection>
            <SettingsHeader>Account Info</SettingsHeader>
            <SettingsSubHeader>
                Setup your body measurements and let us calculate your TDEE to provide a more
                accurate experience.
            </SettingsSubHeader>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    dob,
                    gender,
                    height,
                    weight,
                }}
                validate={validateAccountInfo}
                onSubmit={submitHandler}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} noValidate={true}>
                        <AccountInfoWrapper>
                            <InputMask mask="99/99/9999" onChange={handleChange} value={values.dob}>
                                {(inputProps) => (
                                    <DobInput
                                        id="dob"
                                        name="dob"
                                        label="Birthday"
                                        type="text"
                                        error={errors.dob && touched.dob}
                                        placeholder="05/15/1988"
                                        onChange={handleChange}
                                        value={values.dob}
                                    />
                                )}
                            </InputMask>

                            <InfoInput
                                id="height"
                                name="height"
                                label="Height (in)"
                                type="number"
                                error={errors.height && touched.height}
                                onChange={handleChange}
                                value={values.height}
                            />

                            <InfoInput
                                id="weight"
                                name="weight"
                                label="Weight (lb)"
                                type="number"
                                error={errors.weight && touched.weight}
                                onChange={handleChange}
                                value={values.weight}
                            />
                        </AccountInfoWrapper>

                        <GenderSelectWrapper>
                            <Select
                                id="gender"
                                name="gender"
                                label="Gender"
                                options={['Male', 'Female', 'Non-Binary']}
                                onChange={handleChange}
                                error={errors.gender && touched.gender}
                                value={values.gender}
                                fullWidth={true}
                            />
                        </GenderSelectWrapper>

                        <FormButton
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            Update Info
                        </FormButton>
                    </form>
                )}
            </Formik>
        </SettingsSection>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
