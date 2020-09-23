import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import moment from 'moment';

import {
    Container,
    Header,
    SubHead,
    Form,
    TableContainer,
    FormButton,
    HabitInput
} from './styles';
import Firebase from '../firebase';
import { validateHabit } from '../validation';
import { ErrorMessage } from '../Login/styles';
import { successNotification, errorNotification } from '../actions';
import HabitMenu from './HabitMenu';
import Table, { tableStyle, Header as TableHeader } from '../Table';

const mapDispatchToProps = {
    errorMessage: (message) => errorNotification(message),
    successMessage: (message) => successNotification(message)
};

const mapStateToProps = (state) => ({
    data: state.adminState.data,
    userData: state.adminState.userData
});

function Habits({ errorMessage, successMessage, userData, data }) {
    const [relapse, setRelapse] = useState(false);
    const [sorted, setSorted] = useState([]);
    const habits = Object.entries(data.habits);
    const formattedHabits = habits.map((habit) => habit[1]);

    async function submitHandler(values, actions) {
        const habitRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child('habits');

        // check for dupes
        const alreadyExists =
            habits.filter((habit) => habit[1].name === values.habit).length > 0;

        const habitData = {
            name: values.habit,
            startTime: Date.now()
        };

        if (alreadyExists) {
            errorMessage('Habit already exists');
        } else {
            await habitRef.push(habitData, (error) => {
                if (error) {
                    errorMessage();
                } else {
                    actions.resetForm();
                }
            });
        }

        actions.setSubmitting(false);
    }

    const removeHabit = (name) => {
        const habitKey = habits.filter((habit) => habit[1].name === name)[0][0];

        const habitRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`habits/${habitKey}`);

        habitRef
            .remove()
            .then(() => {
                successMessage('Habit removed');
            })
            .catch(() => {
                errorMessage('Habit could not be removed');
            });
    };

    const resetHabit = () => {
        const habitKey = habits.filter(
            (habit) => habit[1].name === relapse.name
        )[0][0];

        const habitRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`habits/${habitKey}`);

        habitRef
            .update({
                startTime: Date.now()
            })
            .then(() => {
                setRelapse(false);
            })
            .catch(() => {
                errorMessage('Habit could not be reset');
            });
    };

    const closeRelapseDialog = () => setRelapse(false);
    const onSortedChange = (sortedItems) => setSorted(sortedItems);

    function TableActions(row) {
        return (
            <HabitMenu
                remove={() => removeHabit(row.original.name)}
                reset={() => setRelapse(row.original)}
            />
        );
    }

    return (
        <Container>
            <Header>Sobriety Tracker</Header>
            <SubHead>
                Enter a habit or addiction you would like to track daily
            </SubHead>

            <Formik
                initialValues={{ habit: '' }}
                validate={validateHabit}
                onSubmit={submitHandler}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <Fade in={true}>
                        <Form onSubmit={handleSubmit} noValidate={true}>
                            <HabitInput
                                id="habit"
                                name="habit"
                                label="Habit/Addiction"
                                value={values.habit}
                                onChange={handleChange}
                                error={errors.habit && touched.habit}
                            />
                            <ErrorMessage id="habit-error">
                                {errors.habit && touched.habit && errors.habit}
                            </ErrorMessage>

                            <FormButton
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={isSubmitting}
                            >
                                Track
                            </FormButton>
                        </Form>
                    </Fade>
                )}
            </Formik>

            <TableContainer>
                <Table
                    data={formattedHabits}
                    noDataText="No Habits Found"
                    columns={[
                        {
                            Header: (props) => (
                                <TableHeader
                                    name="Addiction"
                                    sorted={sorted}
                                    {...props}
                                />
                            ),
                            accessor: 'name',
                            headerStyle: tableStyle.theadTh,
                            style: tableStyle.cell
                        },
                        {
                            Cell: (row) => {
                                return moment(row.original.startTime).from(
                                    moment(),
                                    true
                                );
                            },
                            Header: (props) => (
                                <TableHeader
                                    name="Duration of Sobriety"
                                    sorted={sorted}
                                    {...props}
                                />
                            ),
                            accessor: 'startTime',
                            headerStyle: tableStyle.theadTh,
                            style: tableStyle.cell
                        },
                        {
                            Cell: TableActions,
                            Header: 'Modify',
                            accessor: 'name',
                            headerStyle: tableStyle.theadTh,
                            style: tableStyle.cellCentered
                        }
                    ]}
                    onSortedChange={onSortedChange}
                />
            </TableContainer>

            {!!relapse && (
                <Dialog
                    maxWidth={'md'}
                    open={!!relapse}
                    onClose={closeRelapseDialog}
                >
                    <DialogTitle>{`Reset ${relapse.name}?`}</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            Are you sure you want to reset your start date to
                            today?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={resetHabit}
                            color="primary"
                            variant="contained"
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={closeRelapseDialog}
                            color="primary"
                            autoFocus={true}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Habits);
