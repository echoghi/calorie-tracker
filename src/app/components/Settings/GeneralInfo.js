import React from 'react';
import { connect } from 'react-redux';
import { auth } from '../firebase.js';
import { errorNotification, successNotification, warningNotification } from '../actions';
import Button from '@material-ui/core/Button';
import isEmpty from 'lodash.isempty';
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
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

const GeneralInfo = ({ userData, errorNotification, successNotification }) => {
    const [state, setState] = React.useState({
        displayName: '',
        validation: {
            displayName: new inputObj(false)
        }
    });

    const { validation } = state;

    React.useEffect(
        () => {
            if (!isEmpty(userData)) {
                const nextState = produce(state, draftState => {
                    draftState.displayName = userData.displayName;
                    draftState.validation.displayName = new inputObj(true);
                });

                setState(nextState);
            }
        },
        [userData]
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

    /**
     * Validate Inputs
     *
     * @return valid - validation status
     */
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

    function validate(name, input) {
        let error = true;

        for (let i in validation[name]) {
            if (validation[name][i].valid) {
                error = false;
            }
        }

        return error && validation[name][input].dirty;
    }

    const onSubmit = event => {
        event.preventDefault();

        if (validateInputs()) {
            let error = false;

            auth.currentUser
                .updateProfile({
                    displayName
                })
                .catch(() => {
                    error = true;
                });

            if (!error) {
                successNotification('Display Name Updated.');

                const nextState = produce(state, draftState => {
                    draftState.validation.displayName = new inputObj(true);
                });

                setState(nextState);
            } else {
                errorNotification();
            }
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

    function validate(input) {
        return !validation[input].valid && validation[input].dirty;
    }

    return (
        <SettingsSection>
            <SettingsHeader>General Info</SettingsHeader>
            <SettingsSubHeader>What would you like to be called?</SettingsSubHeader>
            <form onSubmit={onSubmit}>
                <Input
                    name="displayName"
                    id="displayName"
                    label="Display Name"
                    error={validate('displayName')}
                    onChange={onChange}
                    defaultValue={!isEmpty(userData) ? userData.displayName : ''}
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
                    Change Display Name
                </Button>
            </form>
        </SettingsSection>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GeneralInfo);
