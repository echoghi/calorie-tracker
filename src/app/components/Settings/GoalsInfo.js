import React from 'react';
import Firebase from '../firebase.js';
import { connect } from 'react-redux';
import { errorNotification, successNotification, warningNotification } from '../actions';
import Button from '@material-ui/core/Button';
import produce from 'immer';
import Input from '../Input';
import isEmpty from 'lodash.isempty';
import { SettingsHeader, SettingsSubHeader, SettingsSection } from './styles';

// Reusable validation constuctor for each input
class inputObj {
    constructor(valid) {
        this.valid = valid;
        this.dirty = false;
    }
}

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    data: state.adminState.data
});

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

const GoalsInfo = ({ data, userData, errorNotification, successNotification }) => {
    const [state, setState] = React.useState({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        validation: {
            calories: new inputObj(false),
            carbs: new inputObj(false),
            fat: new inputObj(false),
            protein: new inputObj(false)
        }
    });

    const { validation, calories, carbs, fat, protein } = state;

    React.useEffect(
        () => {
            if (!isEmpty(data)) {
                const nextState = produce(state, draftState => {
                    draftState.calories = data.user.goals.calories;
                    draftState.carbs = data.user.goals.carbs;
                    draftState.fat = data.user.goals.fat;
                    draftState.protein = data.user.goals.protein;

                    for (let type in draftState.validation) {
                        draftState.validation[type] = new inputObj(true);
                    }
                });

                setState(nextState);
            }
        },
        [data]
    );

    const onChange = event => {
        const nextState = produce(state, draftState => {
            const { name, value } = event.target;
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

    function validateInputs() {
        // Check for incompleted fields
        for (let type in validation) {
            if (!validation[type]['valid']) {
                errorNotification('Fields must not be empty.');
                return false;
            }
        }

        return true;
    }

    function validate(input) {
        return !validation[input].valid && validation[input].dirty;
    }

    const onSubmit = () => {
        if (validateInputs()) {
            let goals;

            const queryRef = Firebase.db
                .ref('users')
                .child(userData.uid)
                .child('user/goals');

            queryRef.once('value', snapshot => {
                goals = snapshot.val();
            });

            const goalsUpdate = produce(goals, draftState => {
                if (validation.calories.valid) {
                    draftState.calories = parseInt(calories);
                }

                if (validation.carbs.valid) {
                    draftState.carbs = parseInt(carbs);
                }

                if (validation.fat.valid) {
                    draftState.fat = parseInt(fat);
                }

                if (validation.protein.valid) {
                    draftState.protein = parseInt(protein);
                }
            });

            const nextState = produce(state, draftState => {
                // mark inputs valid
                for (let type in draftState.validation) {
                    draftState.validation[type] = new inputObj(true);
                }
            });

            queryRef.update(goalsUpdate, error => {
                if (error) {
                    errorNotification();
                } else {
                    successNotification('Goals Updated.');

                    setState(nextState);
                }
            });
        } else {
            const nextState = produce(state, draftState => {
                // If there is an invalid input, mark all as dirty on submit to alert the user
                for (let attr in draftState.validation) {
                    if (draftState.validation[attr]) {
                        draftState.validation[attr].dirty = true;
                    }
                }
            });

            setState(nextState);
        }
    };

    return (
        <SettingsSection>
            <SettingsHeader>Goals</SettingsHeader>
            <SettingsSubHeader>
                Already have goals in mind? Enter them here or your calorie goal will be based on
                your TDEE, which is calculated with your height, weight, gender, and age. If you
                haven't provided the necessary info, then your calorie goal will default to 2000.
            </SettingsSubHeader>
            <form>
                <Input
                    name="calories"
                    id="calories"
                    label="Calories (kcal)"
                    type="number"
                    error={validate('calories')}
                    onChange={onChange}
                    style={{ paddingRight: 20 }}
                    value={calories}
                />
                <Input
                    name="carbs"
                    id="carbs"
                    label="Carbs (g)"
                    type="number"
                    error={validate('carbs')}
                    onChange={onChange}
                    style={{ paddingRight: 20 }}
                    value={carbs}
                />
                <Input
                    name="fat"
                    id="fat"
                    label="Fat (g)"
                    type="number"
                    error={validate('fat')}
                    onChange={onChange}
                    style={{ paddingRight: 20 }}
                    value={fat}
                />
                <Input
                    name="protein"
                    id="protein"
                    label="Protein (g)"
                    type="number"
                    error={validate('protein')}
                    onChange={onChange}
                    value={protein}
                />
                <Button
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'bottom',
                        margin: '0 10px'
                    }}
                    color="primary"
                    variant="raised"
                    onClick={onSubmit}
                >
                    Update Goals
                </Button>
            </form>
        </SettingsSection>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoalsInfo);
