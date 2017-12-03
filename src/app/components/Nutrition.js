import React from 'react';
import { connect } from 'react-redux';
import { activatePage, resetNutritionData } from './actions';
import moment from 'moment';
// Components
import NavBar from './NavBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ProgressBar from 'react-progressbar.js';
let { Circle, Line } = ProgressBar;

const mapStateToProps = state => ({
    nutrition: state.navigationState.nutrition,
    data: state.adminState.data,
    activeDay: state.adminState.activeDay
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page)),
    resetNutritionData: () => dispatch(resetNutritionData())
});

// Reusable validation constuctor for each input
let inputObj = () => {
    this.valid = false;
    this.dirty = false;
};

class Nutrition extends React.Component {
	state = {
		now: moment(),
		day: {},
		validation: {
			name: new inputObj(),
			type: new inputObj(),
			calories: new inputObj(),
			protein: new inputObj(),
			carbs: new inputObj(),
			fat: new inputObj()
		}
	};

	componentWillMount() {
		let { nutrition, activatePage } = this.props;
		window.scrollTo(0, 0);

		this.mapDayToState();

		if(!nutrition) {
			activatePage('nutrition');
		}
	}

	componentWillUnmount() {
		this.props.resetNutritionData();
	}

	mapDayToState = () => {
		let { data, activeDay } = this.props;
		let { now, day } = this.state;

		if(!_.isEmpty(activeDay)) {
			day = activeDay;
		} else {
			for(let i = 0; i < data.calendar.length; i++) {
				if(data.calendar[i].day.date() === now.date() && data.calendar[i].day.month() === now.month() && data.calendar[i].day.year() === now.year()) {
					day = data.calendar[i];
				}
			}
		}

		this.setState({ day });
	}

	renderMealsTable() {
		let { day } = this.state;

		return(<ReactTable
	          data={day.nutrition.meals}
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
	          className='-striped -highlight'
        />);
	}

	/**
     * Validate Inputs
     *
     * @return valid - validation status 
     */
    validateInputs() {
        let valid = true;
        // Check for incompleted fields
        for (let key in this.state.validation) {
            if (!this.state.validation[key]['valid']) {
                return false;
            }
        }

        return valid;
    }

	onChange = event => {
		// create a shallow copy of the state to mutate
        let obj = Object.assign({}, this.state);
        // Set value in obj to eventually send to the state
        obj[event.target.name] = event.target.value;
        // Mark input as dirty (interacted with)
        obj['validation'][event.target.name]['dirty'] = true;

        // Remove non-numbers from macro inputs
        if(event.target.name !== 'name' && event.target.name !== 'type') {
        	event.target.value = event.target.value.replace(/[^0-9]/g, '');
            obj[event.target.name] = event.target.value;
        }

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj['validation'][event.target.name]['valid'] = true;
        } else {
            obj['validation'][event.target.name]['valid'] = false;
        }

        this.setState(obj);
	}

	onSubmit = () => {
		if(this.validateInputs()) {
			console.log('submit!');
		} else {
			console.log('error');
			// create a shallow copy of the state to mutate
            let obj = Object.assign({}, this.state);
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in this.state.validation) {
                if (obj['validation'][attr]) {
                    obj['validation'][attr]['dirty'] = true;
                }
            }
            this.setState(obj);
		}
	}

	renderMealBox() {
		let { day, validation } = this.state;
		//let { data } = this.props;

		return (
        	<div className="nutrition__overview--meals">
        		<h3>{`Logged Meals (${day.nutrition.meals.length})`}</h3>
        		<div className="add__meal">
        			<div className="add__meal--input">
	        			<TextField
	        			  name="name"
					      errorText={!validation.name.valid && validation.name.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Name"
					    />
					    <TextField
	        			  name="type"
					      errorText={!validation.type.valid && validation.type.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Type"
					    />
					</div>
					<div className="add__meal--input">
	        			<TextField
	        			  name="calories"
					      errorText={!validation.calories.valid && validation.calories.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Calories"
					    />
					    <TextField
	        			  name="protein"
					      errorText={!validation.protein.valid && validation.protein.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Protein"
					    />
					</div>
					<div className="add__meal--input">
	        			<TextField
	        			  name="carbs"
					      errorText={!validation.carbs.valid && validation.carbs.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Carbohydrates"
					    />
					    <TextField
        				  name="fat"
					      errorText={!validation.fat.valid && validation.fat.dirty ? 'This field is required' : ''}
					      onChange={this.onChange}
					      floatingLabelText="Fat"
					    />
					</div>
					<RaisedButton
                        label="Save"
                        className="add__meal--save"
                        onClick={this.onSubmit}
                        backgroundColor="#ed5454"
                        labelColor="#fff"
                    />
			  	</div>
	        </div>
        );
	}

	renderProgressBar(type) {
		let { day } = this.state;
		let { data } = this.props;
		let color;
		let progress;
		let text;

		if(type === 'protein') {
			color = '#F5729C';
			progress = day.nutrition.protein / data.user.goals.nutrition.protein;
			text = day.nutrition.protein / data.user.goals.nutrition.protein;
		} else if (type === 'carbs') {
			color = '#7BD4F8';
			progress = day.nutrition.carbs / data.user.goals.nutrition.carbs;
			text = day.nutrition.carbs / data.user.goals.nutrition.carbs;
		} else {
			color = '#55F3B3';
			progress = day.nutrition.fat / data.user.goals.nutrition.fat;
			text = day.nutrition.fat / data.user.goals.nutrition.fat;
		}

		// Prevent progress bar bug by converting 100%+ to 100%
		progress = progress > 1 ? progress = 1 : progress;
		text = `${Math.round((text * 100))}% of daily goal`;

		let options = {
            strokeWidth: 3,
            color: color,
            trailColor: '#f4f4f4',
            text: {
            	value: text,
            	style: {
		            color: '#a2a7d9',
		            margin: '15px 0 0 0'
		        }
            }
        };

        let containerStyle = {
            width: '80%',
            margin: '30px auto'
        };

        return (
            <Line
                progress={progress}
                options={options}
                initialAnimate={true}
                containerStyle={containerStyle}
                containerClassName={'.progressbar'} />
        );
	}

	renderCalorieBox() {
		let { day } = this.state;
		let { data } = this.props;
		let calorieGoal = day.fitness.calories ? day.fitness.calories : data.user.goals.nutrition.calories;
		let progress = day.nutrition.calories / calorieGoal;
		let text = day.nutrition.calories / calorieGoal;
		let options = {
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
		progress = progress > 1 ? progress = 1 : progress;
		text = `${Math.round(text * 100)}% of daily goal`;

        return (
        	<div className="nutrition__overview--calories">
        		<h3>Total Calories</h3>
	            <Circle
	                progress={progress}
	                options={options}
	                initialAnimate={true}
	                containerStyle={containerStyle}
	                containerClassName={'.calorie__progress-bar'} />
                <span className="subhead">{text}</span>
	        </div>
        );
	}

	render() {
		let { day } = this.state;
		let { protein, carbs, fat } = day.nutrition;

		return (
			<div>
				<NavBar />
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
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Nutrition);