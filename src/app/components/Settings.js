import React from 'react';
import styled from 'styled-components';
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

class Settings extends React.Component {
    state = {
        fitnessGoal: 'maintain'
    };

    render() {
        console.log(this.state.fitnessGoal);
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
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
                            <Input name="lastName" id="lastName" label="Last Name" onChange={this.onChange} />
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
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="weight"
                                id="weight"
                                label="Weight (lb)"
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
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
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="carbs"
                                id="carbs"
                                label="Carbs (g)"
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="fat"
                                id="fat"
                                label="Fat (g)"
                                onChange={this.onChange}
                                style={{ paddingRight: 20 }}
                            />
                            <Input
                                name="protein"
                                id="protein"
                                label="Protein (g)"
                                onChange={this.onChange}
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
            </div>
        );
    }
}

export default Settings;
