import React from 'react';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { errorNotification, successNotification } from '../actions';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
import Select from '../Select';
import produce from 'immer';
import Input from '../Input';
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
    data: state.adminState.data,
    snackbar: state.notificationState.snackbar
});

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message))
});

const AccountInfo = ({ data, userData, errorNotification, successNotification }) => {
    const [state, setState] = React.useState({
        age: 21,
        gender: 'Male',
        height: 70,
        weight: 150,
        validation: {
            age: new inputObj(false),
            gender: new inputObj(true),
            height: new inputObj(false),
            weight: new inputObj(false)
        }
    });

    const { age, gender, height, weight, validation } = state;

    React.useEffect(() => {
        if (!isEmpty(data)) {
            const nextState = produce(state, draftState => {
                const { height, weight, gender, age } = data.user;

                draftState.height = height;
                draftState.weight = weight;
                draftState.gender = gender;
                draftState.age = age;

                for (let type in draftState.validation) {
                    draftState.validation[type] = new inputObj(true);
                }
            });

            setState(nextState);
        }
    }, [data]);

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
            let user;

            const queryRef = Firebase.db
                .ref('users')
                .child(userData.uid)
                .child('user');

            queryRef.once('value', snapshot => {
                user = snapshot.val();
            });

            const payload = produce(user, updatedUser => {
                if (validation.age.valid) {
                    updatedUser.age = parseInt(age);
                }

                if (validation.gender.valid && gender) {
                    updatedUser.gender = gender;
                }

                if (validation.height.valid) {
                    updatedUser.height = parseInt(height);
                }

                if (validation.weight.valid) {
                    updatedUser.weight = parseInt(weight);
                }
            });

            // update user's account info
            queryRef.update(payload, error => {
                if (error) {
                    errorNotification();
                } else {
                    // reset form
                    const nextState = produce(state, draftState => {
                        for (let type in draftState.validation) {
                            draftState.validation[type] = new inputObj(true);
                        }
                    });

                    setState(nextState);
                    successNotification('Account Info Updated.');
                }
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            const nextState = produce(state, draftState => {
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
            <SettingsHeader>Account Info</SettingsHeader>
            <SettingsSubHeader>
                Setup your body measurements and let us calculate your TDEE to provide a more
                accurate experience.
            </SettingsSubHeader>
            <form>
                <Input
                    name="age"
                    id="age"
                    label="Age"
                    type="number"
                    error={validate('age')}
                    onChange={onChange}
                    style={{ paddingRight: 20 }}
                    value={age}
                />
                <Select
                    name="gender"
                    id="gender"
                    label="Gender"
                    options={['Male', 'Female']}
                    onChange={onChange}
                    error={validate('gender')}
                    style={{ paddingRight: 20 }}
                    value={gender}
                />
                <Input
                    name="height"
                    id="height"
                    label="Height (in)"
                    type="number"
                    error={validate('height')}
                    onChange={onChange}
                    style={{ paddingRight: 20 }}
                    value={height}
                />
                <Input
                    name="weight"
                    id="weight"
                    label="Weight (lb)"
                    type="number"
                    error={validate('weight')}
                    onChange={onChange}
                    value={weight}
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
                    Update Info
                </Button>
            </form>
        </SettingsSection>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountInfo);
