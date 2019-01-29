import React from 'react';
import Input from '../Input';
import Button from '@material-ui/core/Button';
import { MealForm as Form, MealsHeader } from './styles';
import { connect } from 'react-redux';
import produce from 'immer';
import { errorNotification, successNotification, warningNotification } from '../actions';

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

const inputObj = class {
    constructor(valid) {
        this.required = true;
        this.valid = valid;
        this.dirty = false;
    }
};

function MealForm({ day, dayRef, errorNotification, successNotification }) {
    const [state, setState] = React.useState({
        name: '',
        servings: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        validation: {
            name: new inputObj(false),
            servings: new inputObj(false),
            calories: new inputObj(true),
            protein: new inputObj(true),
            carbs: new inputObj(true),
            fat: new inputObj(true)
        }
    });

    const validate = name => state.validation[name].dirty && !state.validation[name].valid;

    /**
     * Validate Inputs
     *
     * @return valid - validation status
     */
    function validateInputs() {
        const { validation } = state;

        // Check for incompleted fields
        for (let key in validation) {
            if (key !== 'note' && !validation[key]['valid']) {
                return false;
            }
        }

        return true;
    }

    const onChange = event => {
        const { name, value } = event.target;

        const nextState = produce(state, draftState => {
            // Mark input as dirty (interacted with)
            draftState.validation[name].dirty = true;
            draftState[name] = value;

            // If there is any value, mark it valid
            if (value !== '') {
                draftState.validation[name].valid = true;
            } else {
                draftState.validation[name].valid = false;
            }
        });

        setState(nextState);
    };

    function onSubmit() {
        const { name, servings, calories, fat, carbs, protein, validation } = state;

        if (validateInputs()) {
            const mealData = produce(day, payload => {
                // convert moment object back to original format
                payload.day = {
                    month: day.day.get('month'),
                    date: day.day.date(),
                    year: day.day.get('year')
                };

                payload.nutrition.calories += parseInt(calories) * parseInt(servings);
                payload.nutrition.fat += parseInt(fat) * parseInt(servings);
                payload.nutrition.protein += parseInt(protein) * parseInt(servings);
                payload.nutrition.carbs += parseInt(carbs) * parseInt(servings);

                if (!day.nutrition.meals) {
                    payload.nutrition.meals = [];
                }

                // add new meal
                payload.nutrition.meals.push({
                    name,
                    servings: parseInt(servings),
                    calories: parseInt(calories),
                    fat: parseInt(fat),
                    protein: parseInt(protein),
                    carbs: parseInt(carbs)
                });
            });

            dayRef.set(mealData, error => {
                if (error) {
                    errorNotification();
                } else {
                    successNotification('Meal Added');

                    const nextState = produce(state, draftState => {
                        draftState.calories = 0;
                        draftState.fat = 0;
                        draftState.carbs = 0;
                        draftState.protein = 0;
                        draftState.name = '';
                        draftState.servings = 0;

                        // reset meal validation
                        for (let attr in draftState.validation) {
                            if (draftState.validation[attr]) {
                                const valid = attr !== 'servings' && attr !== 'name';

                                draftState.validation[attr] = new inputObj(valid);
                            }
                        }
                    });

                    setState(nextState);
                }
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr]) {
                    validation[attr].dirty = true;
                }
            }

            const nextState = produce(state, draftState => {
                draftState.validation = validation;
            });

            setState(nextState);
            errorNotification('Meal name and serving amount must not be empty.');
        }
    }

    const { name, servings, calories, protein, fat, carbs } = state;

    return (
        <div className="nutrition__overview--meals">
            <MealsHeader>
                <span>Meals</span>
                <span>{`${day.nutrition.calories} cal`}</span>
            </MealsHeader>
            <Form className="add__meal" noValidate autoComplete="off" onSubmit={onSubmit}>
                <div className="add__meal--input">
                    <Input
                        name="name"
                        id="name"
                        label="Name"
                        required
                        value={name}
                        onChange={onChange}
                        error={validate('name')}
                        style={{
                            width: '45%'
                        }}
                    />
                    <Input
                        name="servings"
                        id="servings"
                        label="Servings"
                        required
                        value={servings}
                        onChange={onChange}
                        error={validate('servings')}
                        style={{
                            width: '45%'
                        }}
                    />
                </div>
                <div className="add__meal--input">
                    <Input
                        name="calories"
                        id="calories"
                        label="Calories"
                        type="number"
                        required
                        value={calories}
                        onChange={onChange}
                        error={validate('calories')}
                        style={{
                            width: '45%'
                        }}
                    />
                    <Input
                        name="protein"
                        id="protein"
                        label="Protein"
                        type="number"
                        required
                        value={protein}
                        onChange={onChange}
                        error={validate('protein')}
                        style={{
                            width: '45%'
                        }}
                    />
                </div>
                <div className="add__meal--input">
                    <Input
                        name="carbs"
                        id="carbs"
                        label="Carbs"
                        type="number"
                        required
                        value={carbs}
                        onChange={onChange}
                        error={validate('carbs')}
                        style={{
                            width: '45%'
                        }}
                    />
                    <Input
                        name="fat"
                        id="fat"
                        label="Fat"
                        type="number"
                        required
                        value={fat}
                        onChange={onChange}
                        error={validate('fat')}
                        style={{
                            width: '45%'
                        }}
                    />
                </div>
            </Form>

            <Button
                className="add__meal--save"
                fullWidth
                style={{ borderRadius: 0, height: 65, fontSize: 16 }}
                onClick={onSubmit}
                color="primary"
                variant="raised"
            >
                Add Meal
            </Button>
        </div>
    );
}

export default connect(
    null,
    mapDispatchToProps
)(MealForm);
