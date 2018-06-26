import React from 'react';
import { database, auth } from './firebase.js';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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

class inputObj {
    constructor() {
        this.valid = false;
        this.dirty = false;
    }
}

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    deleteAccount: () => dispatch(deleteAccount())
});

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fitnessGoal: 'maintain',
            generalSnackbar: false,
            accountSnackbar: false,
            goalsSnackbar: false,
            validation: {
                general: {
                    firstName: new inputObj(),
                    lastName: new inputObj()
                },
                account: {
                    height: new inputObj(),
                    weight: new inputObj()
                },
                goals: {
                    calories: new inputObj(),
                    carbs: new inputObj(),
                    fat: new inputObj(),
                    protein: new inputObj()
                }
            }
        };

        window.scrollTo(0, 0);
    }

    onGeneralChange = name => event => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation.general[name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation.general[name].valid = true;
        } else {
            obj.validation.general[name].valid = false;
        }

        this.setState(obj);
    };

    onAccountChange = name => event => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation.account[name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation.account[name].valid = true;
        } else {
            obj.validation.account[name].valid = false;
        }

        this.setState(obj);
    };

    onGoalsChange = name => event => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation.goals[name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation.goals[name].valid = true;
        } else {
            obj.validation.goals[name].valid = false;
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
        for (let type in validation) {
            for (let input in validation[type]) {
                if (validation[type][input]['valid']) {
                    return true;
                }
            }
        }

        return valid;
    }

    resetInputs = () => {
        let { validation } = this.state;

        for (let type in validation) {
            for (let input in validation[type]) {
                validation[type][input] = new inputObj();
            }
        }

        this.setState({ validation });
    };

    validate(name, input) {
        const { validation } = this.state;
        let error = true;

        for (let i in validation[name]) {
            if (validation[name][i].valid) {
                error = false;
            }
        }

        return error && validation[name][input].dirty;
    }

    onSubmitGeneral = () => {
        const { firstName, lastName, validation } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            let user;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('user');

            queryRef.once('value', snapshot => {
                user = snapshot.val();
            });

            if (validation.general.firstName.valid) {
                user.firstName = firstName;
                document.getElementById('firstName').value = '';
            }

            if (validation.general.lastName.valid) {
                user.lastName = lastName;
                document.getElementById('lastName').value = '';
            }

            this.setState({ firstName: '', lastName: '', generalSnackbar: true }, () => {
                queryRef.update(user);
                this.resetInputs();
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation.general) {
                if (validation.general[attr]) {
                    validation.general[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    onSubmitAccount = () => {
        const { height, weight, validation } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            let user;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('user');

            queryRef.once('value', snapshot => {
                user = snapshot.val();
            });

            if (validation.account.height.valid) {
                user.height = parseInt(height);
                document.getElementById('height').value = '';
            }

            if (validation.account.weight.valid) {
                user.weight = parseInt(weight);
                document.getElementById('weight').value = '';
            }

            this.setState({ height: '', weight: '', accountSnackbar: true }, () => {
                queryRef.update(user);
                this.resetInputs();
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation.account) {
                if (validation.account[attr]) {
                    validation.account[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    onSubmitGoals = () => {
        const { calories, carbs, fat, protein, validation } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            let goals;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('user/goals');

            queryRef.once('value', snapshot => {
                goals = snapshot.val();
            });

            if (validation.goals.calories.valid) {
                goals.calories = parseInt(calories);
                document.getElementById('calories').value = '';
            }

            if (validation.goals.carbs.valid) {
                goals.carbs = parseInt(carbs);
                document.getElementById('carbs').value = '';
            }

            if (validation.goals.fat.valid) {
                goals.fat = parseInt(fat);
                document.getElementById('fat').value = '';
            }

            if (validation.goals.protein.valid) {
                goals.protein = parseInt(protein);
                document.getElementById('protein').value = '';
            }

            this.setState({ calories: '', carbs: '', fat: '', protein: '', goalsSnackbar: true }, () => {
                queryRef.update(goals);
                this.resetInputs();
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation.goals) {
                if (validation.goals[attr]) {
                    validation.goals[attr].dirty = true;
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

    handleGoalsClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ goalsSnackbar: false });
    };

    deleteAccount() {
        const { userData } = this.props;
        const user = auth.currentUser;

        user.delete()
            .then(() => {
                const userRef = database.ref('users').child(userData.uid);

                userRef.on('value', snapshot => {
                    snapshot.ref.remove();
                    window.location.reload(true);
                });

                console.log('User Account Deleted');
            })
            .catch(error => {
                console.log(error);
            });
    }

    renderAccountDialog = () => {
        const { deleteAccountDialog } = this.state;

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

        if (deleteAccountDialog) {
            return (
                <Dialog open={deleteAccountDialog} onClose={() => this.setState({ deleteAccountDialog: false })}>
                    <DialogTitle>Delete Account?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this account? All of your data will be permanently deleted
                            from our database.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button style={buttonStyle} onClick={() => this.deleteAccount()} color="primary">
                            Delete
                        </Button>
                        <Button
                            style={buttonStyle}
                            onClick={() => this.setState({ deleteAccountDialog: false })}
                            color="primary"
                            autoFocus
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
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
                                error={this.validate('general', 'firstName')}
                                onChange={this.onGeneralChange('firstName')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="lastName"
                                id="lastName"
                                label="Last Name"
                                error={this.validate('general', 'lastName')}
                                onChange={this.onGeneralChange('lastName')}
                            />
                            <Button
                                style={{
                                    fontSize: 14,
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
                                error={this.validate('account', 'height')}
                                onChange={this.onAccountChange('height')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="weight"
                                id="weight"
                                label="Weight (lb)"
                                type="number"
                                error={this.validate('account', 'weight')}
                                onChange={this.onAccountChange('weight')}
                            />
                            <Button
                                style={{
                                    fontSize: 14,
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
                                type="number"
                                error={this.validate('goals', 'calories')}
                                onChange={this.onGoalsChange('calories')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="carbs"
                                id="carbs"
                                label="Carbs (g)"
                                type="number"
                                error={this.validate('goals', 'carbs')}
                                onChange={this.onGoalsChange('carbs')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="fat"
                                id="fat"
                                label="Fat (g)"
                                type="number"
                                error={this.validate('goals', 'fat')}
                                onChange={this.onGoalsChange('fat')}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="protein"
                                id="protein"
                                label="Protein (g)"
                                type="number"
                                error={this.validate('goals', 'protein')}
                                onChange={this.onGoalsChange('protein')}
                            />
                            <Button
                                style={{
                                    fontSize: 14,
                                    height: 43,
                                    display: 'inline-block',
                                    verticalAlign: 'bottom',
                                    margin: '0 10px'
                                }}
                                color="primary"
                                variant="raised"
                                onClick={this.onSubmitGoals}
                            >
                                Update Goals
                            </Button>
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
                            style={{ background: '#cb2431', fontSize: 14, display: 'block' }}
                            color="primary"
                            variant="raised"
                            onClick={() => this.setState({ deleteAccountDialog: true })}
                        >
                            Delete Account
                        </Button>
                    </DeleteAccount>
                </SettingsWrapper>

                {this.renderAccountDialog()}

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

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.goalsSnackbar}
                    autoHideDuration={6000}
                    onClose={this.handleGoalsClose}
                    message={<span id="message-id">Goals Updated</span>}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
