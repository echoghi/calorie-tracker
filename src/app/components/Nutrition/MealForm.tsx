import React, { useState } from 'react';
import Input from '../Input';
import Button from '@material-ui/core/Button';
import { Formik, FormikActions } from 'formik';
import {
    MealForm as Form,
    MealsHeader,
    MealsContainer,
    InputWrapper,
    InputControl
} from './styles';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import produce from 'immer';
import { validateMeal, MealValues } from '../validation';
import { errorNotification, successNotification } from '../actions';
import firebase from 'firebase';
import { RootState, Day, DBMeal } from '../types';
import { Dispatch } from 'redux';
import Downshift from 'downshift';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

interface MealForm {
    index: number;
    day: Day;
    userData: firebase.UserInfo;
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
}

function MealForm({ day, index, userData, errorMessage, successMessage }: MealForm) {
    const [name, setName] = useState('');
    const [formValues, setFormValues] = useState({
        calories: '0',
        carbs: '0',
        fat: '0',
        protein: '0',
        servings: '0'
    });

    const saveMeal = (values: MealValues, actions: FormikActions<MealValues>) => {
        const { calories, fat, protein, carbs, servings } = values;

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
        setName('');
        setFormValues({
            calories: '0',
            carbs: '0',
            fat: '0',
            protein: '0',
            servings: '0'
        });
    };

    let items: DBMeal[] = [];
    const mealsRef = Firebase.db.ref('meals');

    mealsRef.once('value', snapshot => {
        if (snapshot.val()) {
            items = Object.values(snapshot.val());
        }
    });

    const itemToString = (item: DBMeal) => (item ? item.value : '');

    function onSelect(selection: DBMeal) {
        const { calories, carbs, fat, protein } = selection.info;

        setName(selection.info.name);

        setFormValues({
            calories: `${calories}`,
            carbs: `${carbs}`,
            fat: `${fat}`,
            protein: `${protein}`,
            servings: '0'
        });
    }

    return (
        <MealsContainer>
            <MealsHeader>
                <span>Meals</span>
                <span>{`${day.nutrition.calories} cal`}</span>
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
                                <Downshift onChange={onSelect} itemToString={itemToString}>
                                    {({
                                        getInputProps,
                                        getItemProps,
                                        getLabelProps,
                                        getMenuProps,
                                        isOpen,
                                        inputValue,
                                        highlightedIndex,
                                        selectedItem
                                    }) => (
                                        <div
                                            style={{
                                                position: 'relative',
                                                textAlign: 'left',
                                                zIndex: 98
                                            }}
                                        >
                                            <div>
                                                <label
                                                    {...getLabelProps()}
                                                    style={{
                                                        color: 'rgba(0, 0, 0, 0.54)',
                                                        fontFamily: 'Roboto',
                                                        fontSize: 14
                                                    }}
                                                >
                                                    Name*
                                                    <input
                                                        {...getInputProps()}
                                                        style={{
                                                            appearance: 'none',
                                                            backgroundColor: 'white',
                                                            border: '1px solid #CCCCCC',
                                                            borderRadius: 3,
                                                            boxSizing: 'border-box',
                                                            color: 'rgb(49, 49, 49)',
                                                            height: 40,
                                                            marginTop: 3,
                                                            outline: 'none',
                                                            padding: '8px 12px',
                                                            transition: 'border-color 0.2s'
                                                        }}
                                                    />
                                                </label>

                                                <ul
                                                    {...getMenuProps()}
                                                    style={{
                                                        boxShadow: '0px 4px 15px rgba(0,0,0,.15)',
                                                        margin: 0,
                                                        padding: 0,
                                                        position: 'absolute',
                                                        width: '100%'
                                                    }}
                                                >
                                                    {isOpen &&
                                                        items &&
                                                        items
                                                            .filter(
                                                                item =>
                                                                    !inputValue ||
                                                                    item.value
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            inputValue.toLowerCase()
                                                                        )
                                                            )
                                                            .map((item, itemIndex) => (
                                                                <li
                                                                    key={item.value}
                                                                    {...getItemProps({
                                                                        index: itemIndex,
                                                                        item,
                                                                        key: item.value,
                                                                        style: {
                                                                            backgroundColor:
                                                                                highlightedIndex ===
                                                                                itemIndex
                                                                                    ? 'lightgray'
                                                                                    : 'white',

                                                                            borderBottom:
                                                                                '1px solid #e6eaee',
                                                                            display: 'flex',
                                                                            fontWeight:
                                                                                selectedItem ===
                                                                                item
                                                                                    ? 'bold'
                                                                                    : 'normal',
                                                                            justifyContent:
                                                                                'space-between',
                                                                            listStyle: 'none',
                                                                            margin: 0,
                                                                            padding: '10px',
                                                                            transition: '.2s all'
                                                                        }
                                                                    })}
                                                                >
                                                                    {item.value}
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </Downshift>
                            </InputControl>
                            <InputControl>
                                <Input
                                    name="servings"
                                    label="Servings"
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
        </MealsContainer>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MealForm);
