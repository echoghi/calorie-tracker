import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
// Components
import Button from '@material-ui/core/Button';
import Input from './Input';
import ProgressBar from 'react-progress-bar.js';
const { Line } = ProgressBar;
const { Circle } = ProgressBar;

// Reusable validation constuctor for each input
let inputObj = required => {
    this.valid = required ? false : true;
    this.dirty = false;
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
                calories: new inputObj(true),
                exercise: new inputObj(true),
                stand: new inputObj(true)
            }
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

                    dayIndex = Object.keys(day)[0];

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
            if (!validation[key]['valid']) {
                return false;
            }
        }

        return valid;
    }

    onChange = event => {
        const obj = _.cloneDeep(this.state);
        // Mark input as dirty (interacted with)
        obj.validation[event.target.name].dirty = true;
        obj[event.target.name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation[event.target.name].valid = true;
        } else {
            obj.validation[event.target.name].valid = false;
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
        let { dayIndex, exercise, calories, stand, validation } = this.state;

        if (this.validateInputs()) {
            let day;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
            });

            day.fitness.calories += parseInt(calories);
            day.fitness.exercise += parseInt(exercise);
            day.fitness.stand += parseInt(stand);

            document.getElementById('calories').value = '';
            document.getElementById('exercise').value = '';
            document.getElementById('stand').value = '';

            this.setState({ calories: '', exercise: '', stand: '' }, () => {
                queryRef.update(day);
            });
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

    renderDataBox() {
        // const { validation } = this.state;
        // const errorStyle = { textAlign: 'left' };

        return (
            <div className="nutrition__overview--meals">
                <h3>Input Exercise Data</h3>
                <form className="add__meal">
                    <div className="add__meal--input">
                        <Input
                            name="calories"
                            id="calories"
                            label="Calories"
                            onChange={this.onChange}
                            style={{
                                width: '30%'
                            }}
                        />
                        <Input
                            name="exercise"
                            id="exercise"
                            label="Exercise Minutes"
                            onChange={this.onChange}
                            style={{
                                width: '30%'
                            }}
                        />
                        <Input
                            name="stand"
                            id="stand"
                            label="Stand Hours"
                            onChange={this.onChange}
                            style={{
                                width: '30%'
                            }}
                        />
                    </div>
                    <Button color="primary" variant="raised" className="add__meal--save" onClick={this.onSubmit}>
                        Save Data
                    </Button>
                </form>
            </div>
        );
    }

    renderProgressBar(type) {
        const { day, user } = this.state;
        let color;
        let progress;
        let text;
        console.log(day);
        if (type === 'protein') {
            color = '#F5729C';
            progress = day.nutrition.protein / user.goals.nutrition.protein;
            text = day.nutrition.protein / user.goals.nutrition.protein;
        } else if (type === 'carbs') {
            color = '#7BD4F8';
            progress = day.nutrition.carbs / user.goals.nutrition.carbs;
            text = day.nutrition.carbs / user.goals.nutrition.carbs;
        } else {
            color = '#55F3B3';
            progress = day.nutrition.fat / user.goals.nutrition.fat;
            text = day.nutrition.fat / user.goals.nutrition.fat;
        }

        // Prevent progress bar bug by converting 100%+ to 100%
        progress = progress > 1 ? (progress = 1) : progress;
        text = `${Math.round(text * 100)}% of daily goal`;

        const options = {
            strokeWidth: 5,
            color: color,
            trailColor: '#f4f4f4',
            containerStyle: {
                width: '80%',
                margin: '30px auto'
            },
            className: '',
            text: {
                value: text,
                style: {
                    fontSize: '1rem',
                    color: '#a2a7d9',
                    margin: '10px 0 0 0'
                }
            }
        };

        return <Line progress={progress} initialAnimate options={options} containerStyle={options.containerStyle} />;
    }

    renderCalorieBox() {
        let { day, user } = this.state;
        const calorieGoal = day.fitness.calories || user.goals.nutrition.calories;
        let progress = day.nutrition.calories / calorieGoal;
        let text = day.nutrition.calories / calorieGoal;
        const options = {
            strokeWidth: 4,
            color: '#8E81E3',
            trailColor: '#f4f4f4',
            text: {
                value: `${day.nutrition.calories} cal`,
                style: {
                    color: '#a2a7d9',
                    margin: '-175px 0 0 0',
                    fontSize: '40px'
                }
            }
        };
        let containerStyle = {
            width: '300px',
            height: '30px',
            margin: '30px auto 10px auto'
        };

        // Prevent progress bar bug by converting 100%+ to 100%
        progress = progress > 1 ? (progress = 1) : progress;
        text = `${Math.round(text * 100)}% of daily goal`;

        return (
            <div className="nutrition__overview--calories">
                <h3>TBD</h3>

                <Circle progress={progress} options={options} initialAnimate containerStyle={containerStyle} />

                <span className="subhead">{text}</span>
            </div>
        );
    }

    render() {
        const { day, user } = this.state;
        const { calories, exercise, stand } = day.fitness || 0;

        return (
            <div>
                {!this.state.loading && !_.isEmpty(day) && !_.isEmpty(user) ? (
                    <div className="nutrition">
                        <h1>Activity</h1>
                        <h3>{day.day.format('dddd, MMMM Do YYYY')}</h3>
                        <div className="nutrition__overview">
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{calories}</h1>
                                    <span>g</span>
                                    <h3>Calories Burned</h3>
                                </div>
                                {this.renderProgressBar('protein')}
                            </div>
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{exercise}</h1>
                                    <span>g</span>
                                    <h3>Exercise Minutes</h3>
                                </div>
                                {this.renderProgressBar('carbs')}
                            </div>
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{stand}</h1>
                                    <span>g</span>
                                    <h3>Stand Hours</h3>
                                </div>
                                {this.renderProgressBar('fat')}
                            </div>
                        </div>
                        <div className="nutrition__overview">
                            {this.renderCalorieBox()}
                            {this.renderDataBox()}
                        </div>
                    </div>
                ) : (
                    'Loading...'
                )}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Activity));
