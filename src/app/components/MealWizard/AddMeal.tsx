import React from 'react';
import Input from '../Inputs/Input';
import Button from '@material-ui/core/Button';
import { Formik, FormikActions } from 'formik';
import { MealForm as Form, InputWrapper, InputControl } from '../Nutrition/styles';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import { DBMealValues, validateNewMeal } from '../validation';
import { errorNotification, successNotification } from '../actions';
import { MealFormContainer } from './styles';

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message),
    successMessage: (message?: string) => successNotification(message)
};

interface AddMealProps {
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
}

function AddMeal({ errorMessage, successMessage }: AddMealProps) {
    const saveMeal = (values: DBMealValues, actions: FormikActions<DBMealValues>) => {
        const { name, calories, fat, protein, carbs, servingSize } = values;

        const mealsRef = Firebase.db.ref('meals');

        mealsRef.push(
            {
                info: {
                    calories,
                    carbs,
                    fat,
                    name,
                    protein,
                    servingSize
                },
                value: name
            },
            error => {
                if (error) {
                    errorMessage();
                } else {
                    successMessage('Meal successfully saved.');
                }
            }
        );

        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <MealFormContainer>
            <Formik
                initialValues={{
                    calories: '0',
                    carbs: '0',
                    fat: '0',
                    name: '',
                    protein: '0',
                    servingSize: ''
                }}
                validate={validateNewMeal}
                onSubmit={saveMeal}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} noValidate={true}>
                        <InputWrapper>
                            <InputControl>
                                <Input
                                    name="name"
                                    label="Name"
                                    required={true}
                                    value={values.name}
                                    onChange={handleChange}
                                    error={errors.name && touched.name}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    name="servingSize"
                                    label="Serving Size"
                                    required={true}
                                    value={values.servingSize}
                                    onChange={handleChange}
                                    error={errors.servingSize && touched.servingSize}
                                />
                            </InputControl>
                        </InputWrapper>

                        <InputWrapper>
                            <InputControl>
                                <Input
                                    name="calories"
                                    label="Calories"
                                    type="number"
                                    required={true}
                                    value={values.calories}
                                    onChange={handleChange}
                                    error={errors.calories && touched.calories}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    name="protein"
                                    label="Protein"
                                    type="number"
                                    required={true}
                                    value={values.protein}
                                    onChange={handleChange}
                                    error={errors.protein && touched.protein}
                                />
                            </InputControl>
                        </InputWrapper>

                        <InputWrapper>
                            <InputControl>
                                <Input
                                    name="carbs"
                                    label="Carbs"
                                    type="number"
                                    required={true}
                                    value={values.carbs}
                                    onChange={handleChange}
                                    error={errors.carbs && touched.carbs}
                                />
                            </InputControl>
                            <InputControl>
                                <Input
                                    name="fat"
                                    label="Fat"
                                    type="number"
                                    required={true}
                                    value={values.fat}
                                    onChange={handleChange}
                                    error={errors.fat && touched.fat}
                                />
                            </InputControl>
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
        </MealFormContainer>
    );
}

export default connect(
    null,
    mapDispatchToProps
)(AddMeal);
