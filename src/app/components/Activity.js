import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
// Components
import Button from '@material-ui/core/Button';
import Input from './Input';
import ReactTable from 'react-table';
import { Radar } from 'react-chartjs-2';
import { tableStyle, getSortedComponentClass } from './TableUtils';

// Reusable validation constuctor for each input
const inputObj = class {
    constructor(required) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            now: moment(),
            day: {},
            user: {},
            activity: {},
            loading: true,
            validation: {
                calories: new inputObj(false),
                exerciseName: new inputObj(true),
                exerciseType: new inputObj(true),
                minutes: new inputObj(false),
                weight: new inputObj(false),
                repetitions: new inputObj(false)
            },
            sorted: []
        };

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        const { userData } = this.props;

        if (!_.isEmpty(userData)) {
            this.mapDayToState(userData);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userData } = this.props;

        if (userData !== nextProps.userData && !_.isEmpty(nextProps.userData)) {
            this.mapDayToState(nextProps.userData);
        }
    }

    mapDayToState = userData => {
        const { location } = this.props;
        let requestedDate = location.search ? location.search.split('=')[1].split('/') : null;
        let { day, user, activity } = this.state;

        let dayIndex;

        requestedDate = requestedDate ? moment([requestedDate[2], requestedDate[0] - 1, requestedDate[1]]) : null;

        const callback = state => {
            this.setState(state);
        };

        const userRef = database
            .ref('users')
            .child(userData.uid)
            .child('user');

        userRef.once('value', snapshot => {
            user = snapshot.val();
            callback({ user });
        });

        console.log('Day Queried', requestedDate);
        if (requestedDate) {
            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('calendar')
                .orderByChild('day');

            queryRef.on('value', snapshot => {
                snapshot.forEach(childSnapshot => {
                    day = childSnapshot.val();

                    dayIndex = childSnapshot.key;

                    const { year, date, month } = day.day;
                    day.day = moment([year, month, date]);

                    if (
                        day.day.date() === requestedDate.date() &&
                        day.day.month() === requestedDate.month() &&
                        day.day.year() === requestedDate.year()
                    ) {
                        const fitnessRef = database
                            .ref('users')
                            .child(userData.uid)
                            .child(`calendar/${dayIndex}/fitness`);

                        fitnessRef.on('value', snapshot => {
                            activity = snapshot.val();

                            callback({ activity, day, loading: false, requestedDate, dayIndex });
                        });
                    }
                });
            });
        } else {
            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('calendar')
                .orderByChild('day')
                .limitToLast(1);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
                dayIndex = Object.keys(day)[0];

                day = day[dayIndex];

                const { year, date, month } = day.day;
                day.day = moment([year, month, date]);

                const fitnessRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child(`calendar/${dayIndex}/fitness`);

                fitnessRef.on('value', snapshot => {
                    activity = snapshot.val();

                    callback({ activity, day, loading: false, dayIndex });
                });
            });
        }
    };

    renderActivityTable() {
        const { activity, sorted } = this.state;

        return (
            <ReactTable
                style={tableStyle.table}
                ref={instance => (this.tableInstance = instance)}
                data={activity.activites || []}
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

    renderActivityBox() {
        const { validation } = this.state;

        const validate = name =>
            validation[name].dirty && !validation[name].valid && validation[name].required ? true : false;

        return (
            <div className="nutrition__overview--meals">
                <h3>Log Activity</h3>
                <form className="add__meal" noValidate autoComplete="off">
                    <div className="add__meal--input">
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
                    <div className="add__meal--input">
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
                    <div className="add__meal--input">
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
                        <Input
                            name="repetitions"
                            id="repetitions"
                            label="Repetitions"
                            type="number"
                            onChange={this.onChange('repetitions')}
                            error={validate('repetitions')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                </form>

                <Button
                    className="add__meal--save"
                    fullWidth
                    style={{ borderRadius: 0, height: 65, background: '#269bda', fontSize: 16 }}
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
                console.log(validation[key]);
                return false;
            }
        }

        return valid;
    }

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

    typeOnChange = type => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation.type.dirty = true;
        obj.type = type;

        // If there is any value, mark it valid
        if (type !== '') {
            obj.validation.type.valid = true;
        } else {
            obj.validation.type.valid = false;
        }

        this.setState(obj);
    };

    onSubmit = () => {
        const { userData } = this.props;
        let { dayIndex, exerciseName, exerciseType, calories, minutes, validation, weight, repetitions } = this.state;

        if (this.validateInputs()) {
            let day;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
            });

            if (!day.fitness.activites) {
                day.fitness.activites = [];
            }

            day.fitness.activites.push({
                name: exerciseName,
                type: exerciseType,
                calories: calories ? parseInt(calories) : '',
                minutes: calories ? parseInt(minutes) : '',
                weight: weight ? parseInt(weight) : '',
                repetitions: repetitions ? parseInt(repetitions) : ''
            });

            document.getElementById('calories').value = '';
            document.getElementById('exerciseName').value = '';
            document.getElementById('exerciseType').value = '';
            document.getElementById('minutes').value = '';
            document.getElementById('weight').value = '';
            document.getElementById('repetitions').value = '';

            this.setState(
                { calories: '', minutes: '', exerciseName: '', exerciseType: '', repetitions: '', weight: '' },
                () => {
                    queryRef.update(day);
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
        let { day } = this.state;
        let labels = [];
        let dataPoints = [];

        for (let i in day.fitness.activites) {
            const activity = day.fitness.activites[i];

            labels.push(activity.name);
            dataPoints.push(activity.minutes);
        }

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Exercise Minutes',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: dataPoints
                }
            ]
        };

        return (
            <div className="nutrition__overview--calories">
                <Radar data={data} />
            </div>
        );
    }

    render() {
        const { day, user } = this.state;

        return (
            <div>
                {!this.state.loading && !_.isEmpty(day) && !_.isEmpty(user) ? (
                    <div className="nutrition">
                        <h1>Activity</h1>
                        <h3>{day.day.format('dddd, MMMM Do YYYY')}</h3>

                        <div className="nutrition__overview">
                            {this.renderCalorieBox()}
                            {this.renderActivityBox()}
                        </div>
                        {this.renderActivityTable()}
                    </div>
                ) : (
                    'Loading...'
                )}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Activity));
