import React, { useState, useEffect } from 'react';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { errorNotification, successNotification } from '../actions';
import produce from 'immer';
import { Formik, FormikActions } from 'formik';
import isEmpty from 'lodash.isempty';
import {
    SettingsHeader,
    SettingsSubHeader,
    GoalInputWrapper,
    SettingsSection,
    FormButton,
    CalorieInput,
    FatInput,
    ProteinInput,
    CarbInput
} from './styles';
import { RootState, UserData } from '../types';
import firebase from 'firebase';
import { GoalsValues, validateGoalsInfo } from '../validation';

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message),
    successMessage: (message?: string) => successNotification(message)
};

interface GoalsInfo {
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
    userData: firebase.UserInfo;
    data: UserData;
}

const GoalsInfo = ({ data, userData, errorMessage, successMessage }: GoalsInfo) => {
    const [calories, setCalories] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [protein, setProtein] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setCalories(data.user.goals.calories);
            setCarbs(data.user.goals.carbs);
            setFat(data.user.goals.fat);
            setProtein(data.user.goals.protein);
        }
    }, [data]);

    const submitHandler = (values: GoalsValues, actions: FormikActions<GoalsValues>) => {
        let goals = {
            calories: 0,
            carbs: 0,
            fat: 0,
            protein: 0
        };

        const queryRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child('user/goals');

        queryRef.once('value', snapshot => {
            goals = snapshot.val();
        });

        const goalsUpdate = produce(goals, draftState => {
            draftState.calories = values.calories;
            draftState.carbs = values.carbs;
            draftState.fat = values.fat;
            draftState.protein = values.protein;
        });

        queryRef.update(goalsUpdate, error => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Goals Updated.');

                setCalories(goalsUpdate.calories);
                setCarbs(goalsUpdate.carbs);
                setFat(goalsUpdate.fat);
                setProtein(goalsUpdate.protein);
            }
        });

        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <SettingsSection>
            <SettingsHeader>Goals</SettingsHeader>
            <SettingsSubHeader>
                Already have goals in mind? Enter them here or your calorie goal will default to
                2000.
            </SettingsSubHeader>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    calories,
                    carbs,
                    fat,
                    protein
                }}
                validate={validateGoalsInfo}
                onSubmit={submitHandler}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit} noValidate={true}>
                        <GoalInputWrapper>
                            <CalorieInput
                                name="calories"
                                label="Calories (kcal)"
                                type="number"
                                error={errors.calories && touched.calories}
                                onChange={handleChange}
                                value={values.calories}
                            />

                            <CarbInput
                                name="carbs"
                                label="Carbs (g)"
                                type="number"
                                error={errors.carbs && touched.carbs}
                                onChange={handleChange}
                                value={values.carbs}
                            />
                        </GoalInputWrapper>

                        <GoalInputWrapper>
                            <FatInput
                                name="fat"
                                label="Fat (g)"
                                type="number"
                                error={errors.fat && touched.fat}
                                onChange={handleChange}
                                value={values.fat}
                            />

                            <ProteinInput
                                name="protein"
                                label="Protein (g)"
                                type="number"
                                error={errors.protein && touched.protein}
                                onChange={handleChange}
                                value={values.protein}
                            />
                        </GoalInputWrapper>

                        <FormButton
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Update Goals
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
)(GoalsInfo);
