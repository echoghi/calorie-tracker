import React, { useState, useEffect } from 'react';
import Input from '../Inputs/Input';
import { Formik, FormikActions } from 'formik';
import {
    MealForm as Form,
    MealsHeader,
    MealsContainer,
    InputWrapper,
    InputControl,
    MealFormButton,
    Counter,
    CounterContainer
} from './styles';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import produce from 'immer';
import { validateMeal, MealValues } from '../validation';
import { errorNotification, successNotification, clearMeal } from '../actions';
import firebase from 'firebase';
import { RootState, Day, MealFormState, UserData } from '../types';

const mapDispatchToProps = {
    clearMeal: () => clearMeal(),
    errorMessage: (message?: string) => errorNotification(message),
    successMessage: (message?: string) => successNotification(message)
};

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    meal: state.mealState.meal,
    userData: state.adminState.userData
});

interface MealForm {
    index: number;
    day: Day;
    data: UserData;
    userData: firebase.UserInfo;
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
    clearMeal: () => void;
    meal: MealFormState;
}

function MealForm({
    clearMeal,
    data,
    day,
    errorMessage,
    index,
    userData,
    meal,
    successMessage
}: MealForm) {
    const { calories, carbs, fat, name, protein, servings } = meal;

    // populate form on copy
    useEffect(() => {
        setFormValues(meal);
    }, [meal]);

    // clear meal on unmount
    useEffect(() => {
        return () => {
            clearMeal();
        };
    }, []);

    const [formValues, setFormValues] = useState({
        calories,
        carbs,
        fat,
        name,
        protein,
        servings
    });

    const saveMeal = (values: MealValues, actions: FormikActions<MealValues>) => {
        const { calories, fat, protein, carbs, servings, name } = values;

        const mealData = produce(day, payload => {
            // convert moment object back to original format
            payload.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year')
            };

            function servingSize(type: string) {
                // prettier-ignore
                return parseInt((+type * +servings).toFixed(2), 10);
            }

            payload.nutrition.calories += servingSize(calories);
            payload.nutrition.fat += servingSize(fat);
            payload.nutrition.protein += servingSize(protein);
            payload.nutrition.carbs += servingSize(carbs);

            if (!day.nutrition.meals) {
                payload.nutrition.meals = [];
            }

            // add new meal
            payload.nutrition.meals.push({
                calories: +calories,
                carbs: +carbs,
                fat: +fat,
                name,
                protein: +protein,
                servings: +servings
            });
        });

        const dayRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${index}`);

        dayRef.set(mealData, error => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Meal Added');
            }
        });

        actions.setSubmitting(false);
        actions.resetForm();
        clearMeal();
        setFormValues({
            calories: '0',
            carbs: '0',
            fat: '0',
            name: '',
            protein: '0',
            servings: '0'
        });
    };

    function CalorieCount({ count, goal }: { count: number; goal: number }) {
        let countColor;

        if (count < goal / 2 || count > 1.25 * goal) {
            countColor = 'rgb(183, 53, 63)';
        }

        return (
            <CounterContainer>
                <Counter color={countColor}>{`${count}`}</Counter>/<span>{`${goal} cal`}</span>
            </CounterContainer>
        );
    }

    return (
        <MealsContainer>
            <MealsHeader>
                <span>Meals</span>

                <CalorieCount count={day.nutrition.calories} goal={data.user.goals.calories} />
            </MealsHeader>

            <Formik
                initialValues={formValues}
                validate={validateMeal}
                onSubmit={saveMeal}
                enableReinitialize={true}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} noValidate={true}>
                        <InputWrapper>
                            <InputControl>
                                <Input
                                    id="name"
                                    name="name"
                                    label="Name"
                                    required={true}
                                    value={values.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Turkey Sandwich"
                                    error={errors.name && touched.name}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    id="servings"
                                    name="servings"
                                    label="Servings"
                                    type="number"
                                    required={true}
                                    value={values.servings}
                                    onChange={handleChange}
                                    error={errors.servings && touched.servings}
                                />
                            </InputControl>
                        </InputWrapper>

                        <InputWrapper>
                            <InputControl>
                                <Input
                                    id="calories"
                                    name="calories"
                                    label="Calories"
                                    type="number"
                                    required={false}
                                    value={values.calories}
                                    onChange={handleChange}
                                    error={errors.calories && touched.calories}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    id="protein"
                                    name="protein"
                                    label="Protein"
                                    type="number"
                                    required={false}
                                    value={values.protein}
                                    onChange={handleChange}
                                    error={errors.protein && touched.protein}
                                />
                            </InputControl>
                        </InputWrapper>

                        <InputWrapper>
                            <InputControl>
                                <Input
                                    id="carbs"
                                    name="carbs"
                                    label="Carbs"
                                    type="number"
                                    required={false}
                                    value={values.carbs}
                                    onChange={handleChange}
                                    error={errors.carbs && touched.carbs}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    id="fat"
                                    name="fat"
                                    label="Fat"
                                    type="number"
                                    required={false}
                                    value={values.fat}
                                    onChange={handleChange}
                                    error={errors.fat && touched.fat}
                                />
                            </InputControl>
                        </InputWrapper>

                        <MealFormButton
                            fullWidth={true}
                            disabled={isSubmitting}
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Add Meal
                        </MealFormButton>
                    </Form>
                )}
            </Formik>
        </MealsContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MealForm);
