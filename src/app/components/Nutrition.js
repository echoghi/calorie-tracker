import React from 'react';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
// Components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTooltip from 'react-tooltip';
import ProgressBar from './ProgressBar.js';

// Reusable validation constuctor for each input
let inputObj = () => {
    this.valid = false;
    this.dirty = false;
};

class Nutrition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: moment(),
            day: {},
            user: {},
            loading: true,
            types: ['Supplement', 'Mexican/Fast Food', 'Breakfast/Starbucks', 'Breakfast', 'Starbucks', 'Custom Meal'],
            validation: {
                name: new inputObj(),
                type: new inputObj(),
                calories: new inputObj(),
                protein: new inputObj(),
                carbs: new inputObj(),
                fat: new inputObj()
            }
        };

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this.mapDayToState();
    }

    mapDayToState = () => {
        const { location } = this.props;
        let requestedDate = location.search ? location.search.split('=')[1].split('/') : null;
        let { day, user } = this.state;

        requestedDate = requestedDate ? moment([requestedDate[2], requestedDate[0] - 1, requestedDate[1]]) : null;

        const callback = state => {
            this.setState(state);
        };

        const userRef = database
            .ref('users')
            .child('-L1W7yroxzFV-EPpK63D')
            .child('user');

        userRef.once('value', snapshot => {
            user = snapshot.val();
            callback({ user });
        });

        console.log('Day Queried', requestedDate);
        if (requestedDate) {
            const queryRef = database
                .ref('users')
                .child('-L1W7yroxzFV-EPpK63D')
                .child('calendar')
                .orderByChild('day');

            queryRef.on('value', snapshot => {
                snapshot.forEach(childSnapshot => {
                    day = childSnapshot.val();

                    const { year, date, month } = day.day;
                    day.day = moment([year, month, date]);

                    if (
                        day.day.date() === requestedDate.date() &&
                        day.day.month() === requestedDate.month() &&
                        day.day.year() === requestedDate.year()
                    ) {
                        callback({ day, loading: false, requestedDate, dayIndex: Object.keys(day)[0] });
                        return;
                    }
                });
            });
        } else {
            const queryRef = database
                .ref('users')
                .child('-L1W7yroxzFV-EPpK63D')
                .child('calendar')
                .orderByChild('day')
                .limitToLast(1);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
                const index = Object.keys(day)[0];

                day = day[index];

                const { year, date, month } = day.day;
                day.day = moment([year, month, date]);

                callback({ day, loading: false, dayIndex: index });
            });
        }
    };

    renderMealsTable() {
        const { day } = this.state;

        return (
            <ReactTable
                data={day.nutrition.meals || []}
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
        const { dayIndex, calories, fat, carbs, protein, validation } = this.state;

        if (this.validateInputs()) {
            let day;

            const queryRef = database
                .ref('users')
                .child('-L1W7yroxzFV-EPpK63D')
                .child(`calendar/${dayIndex}`);

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
        const { day, validation } = this.state;

        return (
            <div className="nutrition__overview--meals">
                <h3>{`Logged Meals (${day.nutrition.meals ? day.nutrition.meals.length : 0})`}</h3>
                <form className="add__meal">
                    <div className="add__meal--input">
                        <TextField
                            name="name"
                            id="name"
                            errorText={!validation.name.valid && validation.name.dirty ? 'This field is required' : ''}
                            onChange={this.onChange}
                            floatingLabelText="Name"
                            style={{
                                width: '45%'
                            }}
                        />
                        <AutoComplete
                            floatingLabelText="Type"
                            id="type"
                            errorText={!validation.type.valid && validation.type.dirty ? 'This field is required' : ''}
                            dataSource={this.state.types}
                            filter={AutoComplete.caseInsensitiveFilter}
                            onUpdateInput={this.typeOnChange}
                            fullWidth={true}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <div className="add__meal--input">
                        <TextField
                            name="calories"
                            id="calories"
                            errorText={
                                !validation.calories.valid && validation.calories.dirty ? 'This field is required' : ''
                            }
                            onChange={this.onChange}
                            floatingLabelText="Calories"
                            style={{
                                width: '45%'
                            }}
                        />
                        <TextField
                            name="protein"
                            id="protein"
                            errorText={
                                !validation.protein.valid && validation.protein.dirty ? 'This field is required' : ''
                            }
                            onChange={this.onChange}
                            floatingLabelText="Protein"
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <div className="add__meal--input">
                        <TextField
                            name="carbs"
                            id="carbs"
                            errorText={
                                !validation.carbs.valid && validation.carbs.dirty ? 'This field is required' : ''
                            }
                            onChange={this.onChange}
                            floatingLabelText="Carbohydrates"
                            style={{
                                width: '45%'
                            }}
                        />
                        <TextField
                            name="fat"
                            id="fat"
                            errorText={!validation.fat.valid && validation.fat.dirty ? 'This field is required' : ''}
                            onChange={this.onChange}
                            floatingLabelText="Fat"
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <RaisedButton
                        label="Add Meal"
                        className="add__meal--save"
                        onClick={this.onSubmit}
                        backgroundColor="#ed5454"
                        labelColor="#fff"
                    />
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

        text = `${Math.round(text * 100)}% of daily goal`;

        const options = {
            height: 12.5,
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
                    margin: '15px 0 0 0'
                }
            }
        };

        return <ProgressBar progress={progress} options={options} />;
    }

    renderCalorieBox() {
        let { day, user } = this.state;
        let calorieGoal = day.fitness.calories || user.goals.nutrition.calories;
        //let progress = day.nutrition.calories / calorieGoal;
        let text = day.nutrition.calories / calorieGoal;
        /*let options = {
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
        text = `${Math.round(text * 100)}% of daily goal`; */

        return (
            <div className="nutrition__overview--calories">
                <h3>Total Calories</h3>
                <i className="icon-help-circle" data-for="calorie-tooltip" data-tip="tooltip" />
                <ReactTooltip class="calorie__tooltip" type="info" id="calorie-tooltip">
                    <span>
                        The progress bar represents your calories consumed vs your calories burned. If you have not yet
                        entered in your activity data for this day, the progress bar will default to your calorie goal.
                    </span>
                </ReactTooltip>

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

export default withRouter(Nutrition);
