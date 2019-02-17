import React from 'react';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { errorNotification, successNotification } from '../actions';
import Button from '@material-ui/core/Button';
import Select from '../Select';
import produce from 'immer';
import Input from '../Input';
import { SettingsHeader, SettingsSubHeader, SettingsSection } from './styles';
import { RootState } from '../types';
import { Dispatch } from 'redux';
import firebase from 'firebase';
import isEmpty from 'lodash.isempty';
import { validateAccountInfo, InfoValues } from '../validation';
import { Formik, FormikActions } from 'formik';

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

export interface Note {
    title: string;
    time: string;
    body: string;
    edited?: boolean;
    [index: string]: string | boolean;
}

export interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
    };
    day: any;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
}

export interface UserData {
    user: {
        age: number;
        height: number;
        weight: number;
        gender: string;
        newAccount: boolean;
        goals: {
            fat: number;
            carbs: number;
            calories: number;
            protein: number;
        };
    };
    calendar: Day[];
}

interface AccountInfo {
    data: UserData;
    userData: firebase.UserInfo;
    successMessage: (message?: string) => void;
    errorMessage: (message?: string) => void;
}

const AccountInfo = ({ data, userData, errorMessage, successMessage }: AccountInfo) => {
    const [age, setAge] = React.useState(21);
    const [gender, setGender] = React.useState('Male');
    const [height, setHeight] = React.useState(70);
    const [weight, setWeight] = React.useState(150);

    React.useEffect(() => {
        if (!isEmpty(data)) {
            setAge(data.user.age || 21);
            setHeight(data.user.height);
            setWeight(data.user.weight);
            setGender(data.user.gender || 'Male');
        }
    }, [data]);

    const submitHandler = (values: InfoValues, actions: FormikActions<InfoValues>) => {
        let user = {
            age: 0,
            gender: '',
            height: 0,
            weight: 0
        };

        const queryRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child('user');

        queryRef.once('value', snapshot => {
            user = snapshot.val();
        });

        const payload = produce(user, updatedUser => {
            updatedUser.age = +values.age;
            updatedUser.gender = values.gender;
            updatedUser.height = +values.height;
            updatedUser.weight = +values.weight;
        });

        // update user's account info
        queryRef.update(payload, error => {
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
                    age,
                    gender,
                    height,
                    weight
                }}
                validate={validateAccountInfo}
                onSubmit={submitHandler}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} noValidate={true}>
                        <Input
                            name="age"
                            label="Age"
                            type="number"
                            error={errors.age && touched.age}
                            onChange={handleChange}
                            style={{ paddingRight: 20, width: 100 }}
                            value={values.age}
                        />

                        <Input
                            name="height"
                            label="Height (in)"
                            type="number"
                            error={errors.height && touched.height}
                            onChange={handleChange}
                            style={{ paddingRight: 20, width: 100 }}
                            value={values.height}
                        />

                        <Input
                            name="weight"
                            label="Weight (lb)"
                            type="number"
                            error={errors.weight && touched.weight}
                            onChange={handleChange}
                            value={values.weight}
                            style={{ paddingRight: 20, width: 100 }}
                        />

                        <Select
                            name="gender"
                            label="Gender"
                            options={['Male', 'Female']}
                            onChange={handleChange}
                            error={errors.gender && touched.gender}
                            value={values.gender}
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
                            Update Info
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
)(AccountInfo);
