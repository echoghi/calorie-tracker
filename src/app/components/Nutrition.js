import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
// Components
import Input from './Input';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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

class Nutrition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            now: moment(),
            day: {},
            user: {},
            loading: true,
            saveMeal: false,
            mealTypes: [],
            validation: {
                name: new inputObj(true),
                type: new inputObj(),
                calories: new inputObj(true),
                protein: new inputObj(true),
                carbs: new inputObj(true),
                fat: new inputObj(true)
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
        let { day, user, meals, mealTypes } = this.state;

        let dayIndex;

        requestedDate = requestedDate ? moment([requestedDate[2], requestedDate[0] - 1, requestedDate[1]]) : null;

        const callback = state => {
            this.setState(state);
        };
        console.log(userData);
        const userRef = database
            .ref('users')
            .child(userData.uid)
            .child('user');

        userRef.once('value', snapshot => {
            user = snapshot.val();
            callback({ user });
        });

        const mealTypeRef = database
            .ref('users')
            .child(userData.uid)
            .child('mealTypes');

        mealTypeRef.on('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                let mealType = childSnapshot.val();
                mealTypes.push(mealType.type);
            });

            callback({ mealTypes });
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
                        const mealsRef = database
                            .ref('users')
                            .child(userData.uid)
                            .child(`calendar/${dayIndex}/nutrition/meals`);

                        mealsRef.on('value', snapshot => {
                            meals = snapshot.val();

                            callback({ meals, day, loading: false, requestedDate, dayIndex });
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

                const mealsRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child(`calendar/${dayIndex}/nutrition/meals`);

                mealsRef.on('value', snapshot => {
                    meals = snapshot.val();

                    callback({ meals, day, loading: false, dayIndex });
                });
            });
        }
    };

    renderMealsTable() {
        const { meals } = this.state;

        return (
            <ReactTable
                data={meals || []}
                noDataText="No Meals Found"
                columns={[
                    {
                        Header: 'Meals',
                        columns: [
                            {
                                Header: 'Name',
                                id: 'name',
                                accessor: d => d.name
                            },
                            {
                                Header: 'Type',
                                id: 'type',
                                accessor: d => d.type
                            }
                        ]
                    },
                    {
                        Header: 'Nutritional Information (g)',
                        columns: [
                            {
                                Header: 'Calories',
                                id: 'calories',
                                accessor: d => d.calories
                            },
                            {
                                Header: 'Protein',
                                id: 'protein',
                                accessor: d => d.protein
                            },
                            {
                                Header: 'Carbohydrates',
                                id: 'carbs',
                                accessor: d => d.carbs
                            },
                            {
                                Header: 'Fat',
                                id: 'fat',
                                accessor: d => d.fat
                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
            />
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
        let {
            dayIndex,
            name,
            type,
            calories,
            fat,
            carbs,
            protein,
            validation,
            saveMeal,
            meals,
            mealTypes
        } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            let day;
            let saveMealType = true;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            const mealsRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}/nutrition/meals`);

            const mealTypeRef = database
                .ref('users')
                .child(userData.uid)
                .child('mealTypes');

            queryRef.on('value', snapshot => {
                day = snapshot.val();
            });

            day.nutrition.calories += parseInt(calories);
            day.nutrition.fat += parseInt(fat);
            day.nutrition.protein += parseInt(protein);
            day.nutrition.carbs += parseInt(carbs);

            document.getElementById('name').value = '';
            document.getElementById('type').value = '';
            document.getElementById('calories').value = '';
            document.getElementById('carbs').value = '';
            document.getElementById('fat').value = '';
            document.getElementById('protein').value = '';

            this.setState({ calories: '', fat: '', carbs: '', protein: '', name: '', type: '' }, () => {
                queryRef.update(day);

                if (saveMeal) {
                    if (!meals) {
                        meals = [];
                    }

                    if (!mealTypes) {
                        mealTypes = [];
                    }

                    mealTypeRef.on('value', snapshot => {
                        snapshot.forEach(childSnapshot => {
                            let snapshot = childSnapshot.val();

                            if (type.toLowerCase() === snapshot.toLowerCase()) {
                                saveMealType = false;
                                type = snapshot;
                            }
                        });
                    });

                    meals.push({
                        name,
                        type,
                        calories: parseFloat(calories),
                        fat: parseFloat(fat),
                        protein: parseFloat(protein),
                        carbs: parseFloat(carbs)
                    });

                    mealsRef.update(meals);

                    // Save the meal type if it doesn't exist
                    if (saveMealType) {
                        mealTypes.push({ type });

                        mealTypeRef.update(mealTypes);
                    }
                }
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

    renderMealBox() {
        const { day } = this.state;

        const checkboxStyle = {
            checkbox: { marginTop: 20, padding: '10px 30px', textAlign: 'left' },
            label: {
                color: '#3d575d'
            }
        };

        return (
            <div className="nutrition__overview--meals">
                <h3>{`Logged Meals (${day.nutrition.meals ? day.nutrition.meals.length : 0})`}</h3>
                <form className="add__meal" noValidate autoComplete="off">
                    <div className="add__meal--input">
                        <Input
                            name="name"
                            id="name"
                            label="Name"
                            onChange={this.onChange}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="type"
                            id="type"
                            label="Type"
                            onChange={this.onChange}
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
                            onChange={this.onChange}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="protein"
                            id="protein"
                            label="Protein"
                            onChange={this.onChange}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <div className="add__meal--input">
                        <Input
                            name="carbs"
                            id="carbs"
                            label="Carbs"
                            onChange={this.onChange}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="fat"
                            id="fat"
                            label="Fat"
                            onChange={this.onChange}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    style={checkboxStyle.checkbox}
                                    onChange={() => this.setState({ saveMeal: !this.state.saveMeal })}
                                />
                            }
                            label="Save Meal"
                        />
                    </FormGroup>

                    <Button className="add__meal--save" onClick={this.onSubmit} color="primary">
                        Add Meal
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
                <h3>Total Calories</h3>
                <Tooltip
                    id="tooltip-top"
                    title={`The progress bar represents your calories consumed vs your calories burned. If you have not yet
                    entered in your activity data for this day, the progress bar will default to your calorie goal.`}
                    placement="top"
                >
                    <i className="icon-help-circle" data-for="calorie-tooltip" data-tip="tooltip" />
                </Tooltip>

                <Circle progress={progress} options={options} initialAnimate containerStyle={containerStyle} />

                <span className="subhead">{text}</span>
            </div>
        );
    }

    render() {
        const { day, user } = this.state;
        const { protein, carbs, fat } = day.nutrition || 0;

        return (
            <div>
                {!this.state.loading && !_.isEmpty(day) && !_.isEmpty(user) ? (
                    <div className="nutrition">
                        <h1>Nutrition</h1>
                        <h3>{day.day.format('dddd, MMMM Do YYYY')}</h3>
                        <div className="nutrition__overview">
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{protein}</h1>
                                    <span>g</span>
                                    <h3>Protein</h3>
                                </div>
                                {this.renderProgressBar('protein')}
                            </div>
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{carbs}</h1>
                                    <span>g</span>
                                    <h3>Carbohydrates</h3>
                                </div>
                                {this.renderProgressBar('carbs')}
                            </div>
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{fat}</h1>
                                    <span>g</span>
                                    <h3>Fat</h3>
                                </div>
                                {this.renderProgressBar('fat')}
                            </div>
                        </div>
                        <div className="nutrition__overview">
                            {this.renderCalorieBox()}
                            {this.renderMealBox()}
                        </div>
                        {this.renderMealsTable()}
                    </div>
                ) : (
                    'Loading...'
                )}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Nutrition));
