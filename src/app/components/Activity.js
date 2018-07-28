import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
import queryString from 'query-string';
import isEmpty from 'lodash.isempty';
import keys from 'lodash.keys';
import values from 'lodash.values';
// Components
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from './Input';
import ReactTable from 'react-table';
import { Bar } from 'react-chartjs-2';
import { tableStyle, getSortedComponentClass } from './TableUtils';
import styled from 'styled-components';

// Reusable validation constuctor for each input
const inputObj = class {
    constructor(required) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    data: state.adminState.data
});

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            day: {},
            formattedDay: {},
            loading: true,
            validation: {
                calories: new inputObj(false),
                exerciseName: new inputObj(true),
                exerciseType: new inputObj(true),
                minutes: new inputObj(false),
                weight: new inputObj(false),
                repetitions: new inputObj(false),
                sets: new inputObj(false)
            },
            sorted: [],
            confirmationDialog: false,
            formSwitch: false
        };

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        const { userData } = this.props;

        if (!isEmpty(userData)) {
            this.mapDayToState(userData);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userData } = this.props;

        if (userData !== nextProps.userData && !isEmpty(nextProps.userData)) {
            this.mapDayToState(nextProps.userData);
        }
    }

    mapDayToState = (userData, today) => {
        const { location, history } = this.props;
        let { day, formattedDay } = this.state;
        let requestedDate = null;

        if (location.search) {
            const parsed = queryString.parse(location.search);
            requestedDate = parseInt(parsed.d);
        }

        let dayIndex;

        requestedDate = requestedDate ? moment(requestedDate) : null;

        const callback = state => {
            this.setState(state);
        };

        const loadToday = () => {
            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('calendar')
                .orderByChild('day')
                .limitToLast(1);

            queryRef.once('value', snapshot => {
                day = snapshot.val();
                formattedDay = snapshot.val();
                dayIndex = Object.keys(day)[0];

                day = day[dayIndex];
                formattedDay = Object.assign({}, day[dayIndex]);

                const { year, date, month } = day.day;
                formattedDay.day = moment([year, month, date]);

                const dayRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child(`calendar/${dayIndex}`);

                callback({
                    day,
                    formattedDay,
                    loading: false,
                    dayIndex,
                    dayRef,
                    todayButton: true,
                    requestedDate: null
                });
            });
        };

        if (!today) {
            if (requestedDate) {
                const queryRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child('calendar')
                    .orderByChild('day');

                queryRef.once('value', snapshot => {
                    snapshot.forEach(childSnapshot => {
                        day = childSnapshot.val();
                        formattedDay = childSnapshot.val();
                        dayIndex = childSnapshot.key;

                        const { year, date, month } = day.day;
                        formattedDay.day = moment([year, month, date]);

                        if (
                            day.day.date() === requestedDate.date() &&
                            day.day.month() === requestedDate.month() &&
                            day.day.year() === requestedDate.year()
                        ) {
                            const dayRef = database
                                .ref('users')
                                .child(userData.uid)
                                .child(`calendar/${dayIndex}`);

                            callback({
                                day,
                                formattedDay,
                                loading: false,
                                requestedDate,
                                dayIndex,
                                dayRef,
                                todayButton: false
                            });
                        }
                    });
                });
            } else {
                loadToday();
            }
        } else {
            history.push('/activity');

            loadToday();
        }
    };

    renderActivityTable() {
        const { day, sorted } = this.state;

        return (
            <ReactTable
                style={tableStyle.table}
                ref={instance => (this.tableInstance = instance)}
                data={!isEmpty(day) && day.fitness.activities ? day.fitness.activities : []}
                noDataText="No Exercises Found"
                columns={[
                    {
                        headerText: 'Exercise',
                        accessor: 'name',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Exercise Type',
                        accessor: 'type',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.weight || '---',
                        headerText: 'Weight (lb)',
                        accessor: 'weight',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.repetitions || '---',
                        headerText: 'Repetitions',
                        accessor: 'repetitions',
                        headerStyle: tableStyle.theadTh,

                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.sets || '---',
                        headerText: 'Sets',
                        accessor: 'sets',
                        headerStyle: tableStyle.theadTh,

                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.calories || '---',
                        headerText: 'Calories',
                        accessor: 'calories',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.minutes || '---',
                        headerText: 'Minutes',
                        accessor: 'minutes',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => this.renderActions(row.index),
                        accessor: 'repetitions',
                        headerStyle: tableStyle.theadTh,
                        Header: 'Modify',
                        style: tableStyle.cellCentered
                    }
                ]}
                getTheadProps={() => {
                    return {
                        style: tableStyle.header
                    };
                }}
                getTheadThProps={() => {
                    return {
                        style: tableStyle.th
                    };
                }}
                getTrGroupProps={() => {
                    return {
                        style: tableStyle.tbodyTr
                    };
                }}
                onSortedChange={sorted =>
                    this.setState({
                        sorted
                    })
                }
                defaultPageSize={10}
                className="-striped -highlight"
            />
        );
    }

    renderActions(index) {
        return (
            <IconButton onClick={() => this.setState({ confirmationDialog: true, deleteExercise: index })}>
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    deleteExercise = index => {
        const { dayRef, day } = this.state;

        day.fitness.activities = day.fitness.activities.filter(exercise => exercise !== day.fitness.activities[index]);

        dayRef.set(day);

        this.setState({ confirmationDialog: false, deleteExercise: null });
    };

    renderWeightInputs() {
        const { validation, formSwitch } = this.state;

        const validate = name =>
            validation[name].dirty && !validation[name].valid && validation[name].required ? true : false;

        if (formSwitch) {
            return (
                <div className="add__exercise--input">
                    <Input
                        name="weight"
                        id="weight"
                        label="Weight"
                        type="number"
                        onChange={this.onChange('weight')}
                        error={validate('weight')}
                        style={{
                            width: '45%'
                        }}
                    />
                    <div className="add__exercise--input-wrapper">
                        <Input
                            name="repetitions"
                            id="repetitions"
                            label="Repetitions"
                            type="number"
                            onChange={this.onChange('repetitions')}
                            error={validate('repetitions')}
                            style={{
                                width: '45%',
                                marginRight: 15
                            }}
                        />
                        <Input
                            name="sets"
                            id="sets"
                            label="Sets"
                            type="number"
                            onChange={this.onChange('sets')}
                            error={validate('sets')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                </div>
            );
        }
    }

    renderCardioInputs() {
        const { validation, formSwitch } = this.state;

        const validate = name =>
            validation[name].dirty && !validation[name].valid && validation[name].required ? true : false;

        if (!formSwitch) {
            return (
                <div className="add__exercise--input">
                    <Input
                        name="calories"
                        id="calories"
                        label="Calories"
                        type="number"
                        onChange={this.onChange('calories')}
                        error={validate('calories')}
                        style={{
                            width: '45%'
                        }}
                    />
                    <Input
                        name="minutes"
                        id="minutes"
                        label="Minutes"
                        type="number"
                        onChange={this.onChange('minutes')}
                        error={validate('minutes')}
                        style={{
                            width: '45%'
                        }}
                    />
                </div>
            );
        }
    }

    renderActivityBox() {
        const { validation, formSwitch } = this.state;

        const validate = name =>
            validation[name].dirty && !validation[name].valid && validation[name].required ? true : false;

        return (
            <div className="activity__overview--exercises">
                <h3>Log Activity</h3>
                <form className="add__exercise" noValidate autoComplete="off">
                    <div className="add__exercise--input">
                        <Input
                            name="exerciseName"
                            id="exerciseName"
                            label="Exercise Name"
                            required
                            onChange={this.onChange('exerciseName')}
                            error={validate('exerciseName')}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="exerciseType"
                            id="exerciseType"
                            label="Exercise Type"
                            required
                            onChange={this.onChange('exerciseType')}
                            error={validate('exerciseType')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    {this.renderCardioInputs()}
                    {this.renderWeightInputs()}
                    <div className="add__exercise--input">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formSwitch}
                                    onChange={this.handleSwitch('formSwitch')}
                                    value="checkedB"
                                    color="primary"
                                />
                            }
                            label="Weight Training"
                        />
                    </div>
                </form>

                <Button
                    className="add__exercise--save"
                    fullWidth
                    style={{ borderRadius: 0, height: 65, fontSize: 16 }}
                    onClick={this.onSubmit}
                    color="primary"
                    variant="raised"
                >
                    Add Exercise
                </Button>
            </div>
        );
    }

    /**
     * Validate Inputs
     *
     * @return valid - validation status
     */
    validateInputs() {
        let { validation } = this.state;
        let valid = true;

        // Check for incompleted fields
        for (let key in validation) {
            if (!validation[key]['valid'] && validation[key].required) {
                return false;
            }
        }

        return valid;
    }

    onChange = name => event => {
        let obj = Object.assign({}, this.state);
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

    handleSwitch = name => event => {
        let obj = Object.assign({}, this.state);

        if (event.target.checked) {
            document.getElementById('exerciseType').value = 'Weight Training';

            // Mark exerciseType dirty
            obj.validation['exerciseType'].dirty = true;
            obj.validation['exerciseType'].valid = true;
            obj['exerciseType'] = 'Weight Training';
        } else {
            document.getElementById('exerciseType').value = '';

            // Mark exerciseType pristine
            obj.validation['exerciseType'].dirty = false;
            obj.validation['exerciseType'].valid = false;
            obj['exerciseType'] = '';
        }

        obj[name] = event.target.checked;

        this.setState(obj);
    };

    onSubmit = () => {
        let {
            dayRef,
            day,
            exerciseName,
            exerciseType,
            calories,
            minutes,
            validation,
            weight,
            repetitions,
            sets,
            formSwitch
        } = this.state;

        if (this.validateInputs()) {
            if (!day.fitness.activities) {
                day.fitness.activities = [];
            }

            day.fitness.activities.push({
                name: exerciseName,
                type: exerciseType,
                calories: calories ? parseInt(calories) : '',
                minutes: calories ? parseInt(minutes) : '',
                weight: weight ? parseInt(weight) : '',
                repetitions: repetitions ? parseInt(repetitions) : '',
                sets: sets ? parseInt(sets) : ''
            });

            if (formSwitch) {
                document.getElementById('weight').value = '';
                document.getElementById('repetitions').value = '';
                document.getElementById('sets').value = '';
            } else {
                document.getElementById('calories').value = '';
                document.getElementById('minutes').value = '';
            }

            document.getElementById('exerciseName').value = '';
            document.getElementById('exerciseType').value = '';

            this.setState(
                {
                    calories: '',
                    minutes: '',
                    exerciseName: '',
                    exerciseType: '',
                    repetitions: '',
                    sets: '',
                    weight: '',
                    formSwitch: false
                },
                () => {
                    dayRef.set(day);
                    // Reset Validation
                    for (let attr in validation) {
                        if (validation[attr]) {
                            if (attr === 'exerciseName' || attr === 'exerciseType') {
                                validation[attr] = new inputObj(true);
                            } else {
                                validation[attr] = new inputObj(false);
                            }
                        }
                    }
                }
            );
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr]) {
                    validation[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    renderCalorieBox() {
        const { data } = this.props;

        let labels = [];
        let counts = {};

        for (let j in data.calendar) {
            const day = data.calendar[j];

            for (let i in day.fitness.activities) {
                const activity = day.fitness.activities[i];

                if (activity) {
                    labels.push(activity.type);
                }
            }
        }

        if (labels.length) {
            for (let i in labels) {
                if (!counts.hasOwnProperty(labels[i])) {
                    counts[labels[i]] = 1;
                } else {
                    counts[labels[i]]++;
                }
            }
        }

        const chartData = {
            labels: keys(counts),
            datasets: [
                {
                    label: 'Exercise History',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: values(counts)
                }
            ]
        };

        return (
            <div className="activity__overview--chart">
                <div style={{ margin: 20, textAlign: 'center' }}>
                    <Bar data={chartData} />
                </div>
            </div>
        );
    }

    renderConfirmationDialog = () => {
        const { confirmationDialog, deleteExercise, day } = this.state;

        if (confirmationDialog) {
            const exercise = day.fitness.activities[deleteExercise];

            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={confirmationDialog}
                    onClose={() => this.setState({ confirmationDialog: false })}
                >
                    <DialogTitle>{`Remove "${exercise.name}"`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to remove this exercise?</DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => this.deleteExercise(deleteExercise)} color="primary" variant="raised">
                            Delete
                        </Button>
                        <Button onClick={() => this.setState({ confirmationDialog: false })} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    render() {
        const { userData, data } = this.props;
        const { day, formattedDay, loading, todayButton } = this.state;

        return (
            <div>
                {!loading && !isEmpty(day) && !isEmpty(data) ? (
                    <div className="activity">
                        <HeaderWrapper>
                            <div>
                                <h1>Activity</h1>
                                <h3>{formattedDay.day.format('dddd, MMMM Do YYYY')}</h3>
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        this.mapDayToState(userData, true);
                                    }}
                                    color="primary"
                                    variant="outlined"
                                    size="large"
                                    disabled={todayButton}
                                >
                                    Today
                                </Button>
                            </div>
                        </HeaderWrapper>

                        <div className="activity__overview">
                            {this.renderCalorieBox()}
                            {this.renderActivityBox()}
                        </div>
                        {this.renderActivityTable()}
                    </div>
                ) : (
                    'Loading...'
                )}
                {this.renderConfirmationDialog()}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Activity));
