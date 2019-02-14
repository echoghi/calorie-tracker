import React from 'react';
import Input from '../Input';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import { MealForm as Form, MealsHeader, InputWrapper } from './styles';
import { connect } from 'react-redux';
import Firebase from '../firebase.js';
import produce from 'immer';
import { validateMeal } from '../validation';
import { errorNotification, successNotification, warningNotification } from '../actions';

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

function MealForm({ day, index, userData, errorNotification, successNotification }) {
    return (
        <div className="nutrition__overview--meals">
            <MealsHeader>
                <span>Meals</span>
                <span>{`${day.nutrition.calories} cal`}</span>
            </MealsHeader>

            <Formik
                initialValues={{ name: '', calories: 0, fat: 0, protein: 0, carbs: 0, servings: 0 }}
                validate={validateMeal}
                onSubmit={(values, actions) => {
                    const { name, calories, fat, protein, carbs, servings } = values;

                    const mealData = produce(day, payload => {
                        // convert moment object back to original format
                        payload.day = {
                            month: day.day.get('month'),
                            date: day.day.date(),
                            year: day.day.get('year')
                        };

                        function servingSize(type) {
                            // prettier-ignore
                            return parseInt((parseInt(type) * parseFloat(servings)).toFixed(2));
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
                            name,
                            servings: parseFloat(servings),
                            calories: parseInt(calories),
                            fat: parseInt(fat),
                            protein: parseInt(protein),
                            carbs: parseInt(carbs)
                        });
                    });

                    const dayRef = Firebase.db
                        .ref('users')
                        .child(userData.uid)
                        .child(`calendar/${index}`);

                    dayRef.set(mealData, error => {
                        if (error) {
                            errorNotification();
                        } else {
                            successNotification('Meal Added');
                        }
                    });

                    actions.setSubmitting(false);
                    actions.resetForm();
                }}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <Input
                                name="name"
                                id="name"
                                label="Name"
                                required
                                value={values.name}
                                onChange={handleChange}
                                error={errors.name && touched.name}
                            />

                            <Input
                                name="servings"
                                id="servings"
                                label="Servings"
                                required
                                value={values.servings}
                                onChange={handleChange}
                                error={errors.servings && touched.servings}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                name="calories"
                                id="calories"
                                label="Calories"
                                type="number"
                                required
                                value={values.calories}
                                onChange={handleChange}
                                error={errors.calories && touched.calories}
                            />

                            <Input
                                name="protein"
                                id="protein"
                                label="Protein"
                                type="number"
                                required
                                value={values.protein}
                                onChange={handleChange}
                                error={errors.protein && touched.protein}
                            />
                        </InputWrapper>

                        <InputWrapper>
                            <Input
                                name="carbs"
                                id="carbs"
                                label="Carbs"
                                type="number"
                                required
                                value={values.carbs}
                                onChange={handleChange}
                                error={errors.carbs && touched.carbs}
                            />

                            <Input
                                name="fat"
                                id="fat"
                                label="Fat"
                                type="number"
                                required
                                value={values.fat}
                                onChange={handleChange}
                                error={errors.fat && touched.fat}
                            />
                        </InputWrapper>

                        <Button
                            style={{
                                borderRadius: 0,
                                height: 65,
                                fontSize: 16,
                                position: 'absolute',
                                bottom: 0,
                                left: 0
                            }}
                            fullWidth
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
        </div>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MealForm);
