import React from 'react';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { errorNotification, successNotification } from '../actions';
import Button from '@material-ui/core/Button';
import produce from 'immer';
import Input from '../Input';
import { Formik, FormikActions } from 'formik';
import isEmpty from 'lodash.isempty';
import { SettingsHeader, SettingsSubHeader, SettingsSection } from './styles';
import { RootState, UserData } from '../types';
import { Dispatch } from 'redux';
import firebase from 'firebase';
import { GoalsValues, validateGoalsInfo } from '../validation';

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

interface GoalsInfo {
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
    userData: firebase.UserInfo;
    data: UserData;
}

const GoalsInfo = ({ data, userData, errorMessage, successMessage }: GoalsInfo) => {
    const [calories, setCalories] = React.useState(0);
    const [carbs, setCarbs] = React.useState(0);
    const [fat, setFat] = React.useState(0);
    const [protein, setProtein] = React.useState(0);

    React.useEffect(() => {
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
                Already have goals in mind? Enter them here or your calorie goal will be based on
                your TDEE, which is calculated with your height, weight, gender, and age. Otherwise,
                your calorie goal will default to 2000.
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
                        <Input
                            name="calories"
                            label="Calories (kcal)"
                            type="number"
                            error={errors.calories && touched.calories}
                            onChange={handleChange}
                            style={{ paddingRight: 20, width: 100 }}
                            value={values.calories}
                        />

                        <Input
                            name="carbs"
                            label="Carbs (g)"
                            type="number"
                            error={errors.carbs && touched.carbs}
                            onChange={handleChange}
                            style={{ paddingRight: 20, width: 100 }}
                            value={values.carbs}
                        />

                        <Input
                            name="fat"
                            label="Fat (g)"
                            type="number"
                            error={errors.fat && touched.fat}
                            onChange={handleChange}
                            style={{ paddingRight: 20, width: 100 }}
                            value={values.fat}
                        />

                        <Input
                            name="protein"
                            label="Protein (g)"
                            type="number"
                            error={errors.protein && touched.protein}
                            onChange={handleChange}
                            value={values.protein}
                            style={{ width: 100 }}
                        />

                        <Button
                            style={{
                                display: 'inline-block',
                                margin: '0 20px',
                                verticalAlign: 'bottom'
                            }}
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Update Goals
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
)(GoalsInfo);
