import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
import moment from 'moment';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    tracker: state.navigationState.tracker,
    data: state.adminState.data
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Nutrition extends React.Component {
	state = {
		now: moment(),
		day: {},
		calories: 0,
		fats: 0,
		carbs: 0
	};

	componentWillMount() {
		let { tracker, activatePage } = this.props;
		window.scrollTo(0, 0);

		this.mapDayToState();

		if(!tracker) {
			activatePage('nutrition');
		}
	}

	mapDayToState = () => {
		let { data } = this.props;
		let { now, day } = this.state;

		for(let i = 0; i < data.calendar.length; i++) {
			if(data.calendar[i].day.date() === now.date() && data.calendar[i].day.month() === now.month() && data.calendar[i].day.year() === now.year()) {
				day = data.calendar[i];
			}
		}

		this.setState({ day });
	}

	render() {
		let { day } = this.state;

		return (
			<div>
				<NavBar />
				<div className="nutrition">
					<h1>Nutrition</h1>
					<div className="nutrition__overview">
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>{day.nutrition.protein}</h1>
								<span>g</span>
								<h3>Protein</h3>
							</div>
						</div>
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>{day.nutrition.carbs}</h1>
								<span>g</span>
								<h3>Carbohydrates</h3>
							</div>
						</div>
						<div className="nutrition__overview--box">
							<div className="nutrition__overview--head">
								<h1>{day.nutrition.fat}</h1>
								<span>g</span>
								<h3>Fat</h3>
							</div>
						</div>
					</div>
					<div className="nutrition__add">
					</div>
				</div>
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Nutrition);