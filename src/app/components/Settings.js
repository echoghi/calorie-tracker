import React from 'react';
import { database } from './firebase.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from './Input';

const SettingsWrapper = styled.div`
    padding: 20px;
    background: #fff;
    border: 1px solid #dbdbdb;
`;

const SettingsHeader = styled.h1`
    font-size: 20px;
    margin: 10px 0;
`;

const SettingsSubHeader = styled.h2`
    font-size: 16px;
    margin: 10px 0 20px 0;
    font-weight: normal;
`;

const SettingsSection = styled.div`
    padding: 15px 0;
    border-bottom: 1px solid #dbdbdb;
`;

const DeleteAccount = styled.div`
    padding: 15px 0;
`;

// Reusable validation constuctor for each input
let inputObj = required => {
    this.valid = required ? false : true;
    this.dirty = false;
};

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

class Settings extends React.Component {
    state = {
        fitnessGoal: 'maintain',
        generalSnackbar: false,
        accountSnackbar: false,
        validation: {
            firstName: new inputObj(true),
            lastName: new inputObj(true),
            height: new inputObj(),
            weight: new inputObj(),
            calories: new inputObj(),
            carbs: new inputObj(),
            fat: new inputObj(),
            protein: new inputObj()
        }
    };

    onChange = name => event => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation[name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation[name].valid = true;
        } else {
            obj.validation[name].valid = false;
        }

        this.setState(obj);
    };

    /**
     * Validate Inputs
     *
     * @return valid - validation status
     */
    validateInputs() {
        const { validation } = this.state;
        let valid = false;
        // Check for incompleted fields
        for (let key in validation) {
            if (validation[key]['valid']) {
                return true;
            }
        }

        return valid;
    }

    validate(name) {
        const { validation } = this.state;

        if (validation[name].dirty && !validation[name].valid) {
            return true;
        } else {
            return false;
        }
    }

    onSubmitGeneral = () => {
        const { firstName, lastName, validation } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            const data = {
                firstName: firstName,
                lastName: lastName
            };

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('user');

            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';

            this.setState({ firstName: '', lastName: '', generalSnackbar: true }, () => {
                queryRef.update(data);
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr] && (attr === 'firstName' || attr === 'lastName')) {
                    validation[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    onSubmitAccount = () => {
        const { height, weight, validation } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            const data = {
                height: height,
                weight: weight
            };

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('user');

            document.getElementById('height').value = '';
            document.getElementById('weight').value = '';

            this.setState({ height: '', weight: '', accountSnackbar: true }, () => {
                queryRef.update(data);
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr] && (attr === 'height' || attr === 'weight')) {
                    validation[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    handleGeneralClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ generalSnackbar: false });
    };

    handleAccountClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ accountSnackbar: false });
    };

    render() {
        return (
            <div className="settings">
                <SettingsWrapper>
                    <SettingsSection>
                        <SettingsHeader>General Info</SettingsHeader>
                        <SettingsSubHeader>What would you like to be called?</SettingsSubHeader>
                        <form>
                            <Input
                                name="firstName"
                                id="firstName"
                                label="First Name"
                                error={this.validate('firstName')}
                                onChange={this.onChange('firstName')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="lastName"
                                id="lastName"
                                label="Last Name"
                                error={this.validate('lastName')}
                                onChange={this.onChange('lastName')}
                            />
                            <Button
                                style={{
                                    background: '#269bda',
                                    fontSize: 16,
                                    height: 43,
                                    display: 'inline-block',
                                    verticalAlign: 'bottom',
                                    margin: '0 10px'
                                }}
                                color="primary"
                                variant="raised"
                                onClick={this.onSubmitGeneral}
                            >
                                Change Display Name
                            </Button>
                        </form>
                    </SettingsSection>

                    <SettingsSection>
                        <SettingsHeader>Account Info</SettingsHeader>
                        <SettingsSubHeader>
                            Setup your body measurements and let us calculate your TDEE to provide a more accurate
                            experience.
                        </SettingsSubHeader>
                        <form>
                            <Input
                                name="height"
                                id="height"
                                label="Height (in)"
                                type="number"
                                error={this.validate('height')}
                                onChange={this.onChange('height')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="weight"
                                id="weight"
                                label="Weight (lb)"
                                type="number"
                                error={this.validate('weight')}
                                onChange={this.onChange('weight')}
                            />
                            <Button
                                style={{
                                    background: '#269bda',
                                    fontSize: 16,
                                    height: 43,
                                    display: 'inline-block',
                                    verticalAlign: 'bottom',
                                    margin: '0 10px'
                                }}
                                color="primary"
                                variant="raised"
                                onClick={this.onSubmitAccount}
                            >
                                Update Info
                            </Button>
                        </form>
                    </SettingsSection>

                    <SettingsSection>
                        <SettingsHeader>Goals</SettingsHeader>
                        <SettingsSubHeader>
                            Are you trying to cut, bulk, or maintain? Pick a strategy and we'll calculate your macros
                            based on your estimated daily expenditure.
                        </SettingsSubHeader>
                        <form>
                            <Input
                                name="calories"
                                id="calories"
                                label="Calories (kcal)"
                                onChange={this.onChange('calories')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="carbs"
                                id="carbs"
                                label="Carbs (g)"
                                onChange={this.onChange('carbs')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="fat"
                                id="fat"
                                label="Fat (g)"
                                onChange={this.onChange('fat')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="protein"
                                id="protein"
                                label="Protein (g)"
                                onChange={this.onChange('protein')}
                                style={{ paddingRight: 20 }}
                            />
                        </form>
                        <FormControl
                            style={{ marginTop: 15 }}
                            value={this.state.fitnessGoal}
                            onChange={event => this.setState({ fitnessGoal: event.target.value })}
                            component="fieldset"
                            required
                        >
                            <FormLabel component="legend">Fitness Goal</FormLabel>
                            <RadioGroup row aria-label="fitness" name="fitness">
                                <FormControlLabel
                                    checked={this.state.fitnessGoal === 'maintain'}
                                    value="maintain"
                                    control={<Radio />}
                                    label="Maintain"
                                    style={{ padding: '0 10px' }}
                                />
                                <FormControlLabel
                                    checked={this.state.fitnessGoal === 'cut'}
                                    value="cut"
                                    control={<Radio />}
                                    label="Cut"
                                    style={{ padding: '0 10px' }}
                                />
                                <FormControlLabel
                                    checked={this.state.fitnessGoal === 'bulk'}
                                    value="bulk"
                                    control={<Radio />}
                                    label="Bulk"
                                    style={{ padding: '0 10px' }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </SettingsSection>

                    <DeleteAccount>
                        <SettingsHeader>Delete Account</SettingsHeader>
                        <SettingsSubHeader>
                            We do our best to give you a great experience - we'll be sad to see you leave us.{' '}
                        </SettingsSubHeader>

                        <Button
                            style={{ background: '#cb2431', fontSize: 16, display: 'block' }}
                            color="primary"
                            variant="raised"
                        >
                            Delete Account
                        </Button>
                    </DeleteAccount>
                </SettingsWrapper>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.generalSnackbar}
                    autoHideDuration={6000}
                    onClose={this.handleGeneralClose}
                    message={<span id="message-id">Display Name Saved</span>}
                />

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.accountSnackbar}
                    autoHideDuration={6000}
                    onClose={this.handleAccountClose}
                    message={<span id="message-id">Account Info Updated</span>}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Settings);
