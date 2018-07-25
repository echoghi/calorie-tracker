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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
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
            snackbar: false,
            messageInfo: {},
            validation: {
                general: {
                    displayName: new inputObj()
                },
                account: {
                    age: new inputObj(),
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

        this.queue = [];

        window.scrollTo(0, 0);
    }

    onGeneralChange = name => event => {
        let obj = Object.assign({}, this.state);
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
        let obj = Object.assign({}, this.state);
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
        let obj = Object.assign({}, this.state);
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
        const { displayName, validation, snackbar } = this.state;

        if (this.validateInputs()) {
            auth.currentUser
                .updateProfile({
                    displayName
                })
                .catch(error => {
                    console.log(error);
                });

            document.getElementById('displayName').value = '';

            this.queue.push({
                message: 'Display Name Updated',
                key: new Date().getTime()
            });

            if (snackbar) {
                // immediately begin dismissing current message
                // to start showing new one
                this.setState({ snackbar: false });
            } else {
                this.processQueue();
            }

            this.setState({ displayName: '' }, () => {
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
        const { age, height, weight, validation, snackbar } = this.state;
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

            if (validation.account.age.valid) {
                user.age = parseInt(age);
                document.getElementById('age').value = '';
            }

            if (validation.account.height.valid) {
                user.height = parseInt(height);
                document.getElementById('height').value = '';
            }

            if (validation.account.weight.valid) {
                user.weight = parseInt(weight);
                document.getElementById('weight').value = '';
            }

            this.queue.push({
                message: 'Account Info Updated',
                key: new Date().getTime()
            });

            if (snackbar) {
                // immediately begin dismissing current message
                // to start showing new one
                this.setState({ snackbar: false });
            } else {
                this.processQueue();
            }

            this.setState({ height: '', weight: '', age: '' }, () => {
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
        const { calories, carbs, fat, protein, validation, snackbar } = this.state;
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

            this.queue.push({
                message: 'Account Goals Update',
                key: new Date().getTime()
            });

            if (snackbar) {
                // immediately begin dismissing current message
                // to start showing new one
                this.setState({ snackbar: false });
            } else {
                this.processQueue();
            }

            this.setState({ calories: '', carbs: '', fat: '', protein: '' }, () => {
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

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                snackbar: true
            });
        }
    };

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackbar: false });
    };

    handleExited = () => {
        this.processQueue();
    };

    renderSnackBar() {
        const { snackbar, messageInfo } = this.state;
        const { message, key } = messageInfo;

        const snackbarOrigin = {
            vertical: 'bottom',
            horizontal: 'left'
        };

        if (snackbar) {
            return (
                <Snackbar
                    key={key}
                    anchorOrigin={snackbarOrigin}
                    open={snackbar}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                    onExited={this.handleExited}
                    message={<span id="message-id">{message}</span>}
                    action={[
                        <IconButton key="close" aria-label="Close" onClick={this.handleSnackbarClose}>
                            <i className="icon-x2" style={{ color: 'white' }} />
                        </IconButton>
                    ]}
                />
            );
        }
    }

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
                        <Button
                            style={{ background: '#cb2431', color: 'white' }}
                            onClick={() => this.deleteAccount()}
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button onClick={() => this.setState({ deleteAccountDialog: false })} color="primary" autoFocus>
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
                                name="displayName"
                                id="displayName"
                                label="Display Name"
                                error={this.validate('general', 'displayName')}
                                onChange={this.onGeneralChange('displayName')}
                            />
                            <Button
                                style={{
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
                                name="age"
                                id="age"
                                label="Age"
                                type="number"
                                error={this.validate('account', 'age')}
                                onChange={this.onAccountChange('age')}
                                style={{ paddingRight: 20 }}
                            />
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
                            Already have goals in mind? Enter them here or your calorie goal will be based on your TDEE,
                            which is calculated with your height, wieght, gender, and age. If you haven't provided the
                            necessary info, then your calorie goal will default to 2000.
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
                        {/* <FormControl
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
                        </FormControl> */}
                    </SettingsSection>

                    <DeleteAccount>
                        <SettingsHeader>Delete Account</SettingsHeader>
                        <SettingsSubHeader>
                            We do our best to give you a great experience - we'll be sad to see you leave us.{' '}
                        </SettingsSubHeader>

                        <Button
                            style={{ background: '#cb2431', display: 'block' }}
                            color="primary"
                            variant="raised"
                            onClick={() => this.setState({ deleteAccountDialog: true })}
                        >
                            Delete Account
                        </Button>
                    </DeleteAccount>
                </SettingsWrapper>

                {this.renderAccountDialog()}

                {this.renderSnackBar()}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
