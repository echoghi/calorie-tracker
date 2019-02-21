import React from 'react';
import Input from '../Input';
import Button from '@material-ui/core/Button';
import { Formik, FormikActions } from 'formik';
import { MealForm as Form, MealsHeader, InputWrapper, MealsContainer } from './styles';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import produce from 'immer';
import moment from 'moment';
import { validateMeal } from '../validation';
import { errorNotification, successNotification } from '../actions';

const mapDispatchToProps = (dispatch: any) => ({
    errorMessage: (message: string) => dispatch(errorNotification(message)),
    successMessage: (message: string) => dispatch(successNotification(message))
});

const mapStateToProps = (state: any) => ({
    userData: state.adminState.userData
});

interface Note {
    title: string;
    time: string;
    body: string;
    edited: boolean;
    [index: string]: boolean | string;
}

interface Meal {
    name: string;
    fat: number;
    calories: number;
    carbs: number;
    protein: number;
    servings: number;
    [index: string]: any;
}

interface DayFormat {
    date: number;
    month: number;
    year: number;
}

interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
        meals?: Meal[];
        [index: string]: number | Meal[];
    };
    day: moment.Moment | DayFormat | any;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
    [index: string]: any;
}

interface UserProps {
    uid: string;
}

interface MealForm {
    index: number;
    day: Day;
    userData: UserProps;
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
}

interface MealValues {
    name: string;
    servings: string;
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
}

function MealForm({ day, index, userData, errorMessage, successMessage }: MealForm) {
    const saveMeal = (values: MealValues, actions: FormikActions<MealValues>) => {
        const { name, calories, fat, protein, carbs, servings } = values;

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
    };

    return (
        <MealsContainer>
            <MealsHeader>
                <span>Meals</span>
                <span>{`${day.nutrition.calories} cal`}</span>
            </MealsHeader>

            <Formik
                initialValues={{
                    calories: '0',
                    carbs: '0',
                    fat: '0',
                    name: '',
                    protein: '0',
                    servings: '0'
                }}
                validate={validateMeal}
                onSubmit={saveMeal}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} noValidate={true}>
                        <InputWrapper>
                            <Input
                                name="name"
                                label="Name"
                                required={true}
                                value={values.name}
                                onChange={handleChange}
                                error={errors.name && touched.name}
                            />

                            <Input
                                name="servings"
                                label="Servings"
                                required={true}
                                value={values.servings}
                                onChange={handleChange}
                                error={errors.servings && touched.servings}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                name="calories"
                                label="Calories"
                                type="number"
                                required={true}
                                value={values.calories}
                                onChange={handleChange}
                                error={errors.calories && touched.calories}
                            />

                            <Input
                                name="protein"
                                label="Protein"
                                type="number"
                                required={true}
                                value={values.protein}
                                onChange={handleChange}
                                error={errors.protein && touched.protein}
                            />
                        </InputWrapper>

                        <InputWrapper>
                            <Input
                                name="carbs"
                                label="Carbs"
                                type="number"
                                required={true}
                                value={values.carbs}
                                onChange={handleChange}
                                error={errors.carbs && touched.carbs}
                            />

                            <Input
                                name="fat"
                                label="Fat"
                                type="number"
                                required={true}
                                value={values.fat}
                                onChange={handleChange}
                                error={errors.fat && touched.fat}
                            />
                        </InputWrapper>

                        <Button
                            style={{
                                borderRadius: 0,
                                bottom: 0,
                                fontSize: 16,
                                height: 65,
                                left: 0,
                                position: 'absolute'
                            }}
                            fullWidth={true}
                            disabled={isSubmitting}
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Add Meal
                        </Button>
                    </Form>
                )}
            </Formik>
        </MealsContainer>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MealForm);
