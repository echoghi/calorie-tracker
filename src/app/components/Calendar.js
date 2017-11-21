import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
import moment from 'moment';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    calendar: state.navigationState.calendar
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Calendar extends React.Component {
	componentWillMount() {
		let { calendar, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!calendar) {
			activatePage('calendar');
		}
	}

	renderDays() {
		let days = moment().daysInMonth();
		let calendarDays = [];

		for(let i = 0; i < days; i++) {
			calendarDays.push(<div className="day" key={i}>
								<div className="number">{i+1}</div>
							</div>);
		}

		return calendarDays;
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="calendar">
					<h2>Calendar</h2>
					<div className="calendar__container">
						<div className="calendar__head">
							<span>Mon</span>
							<span>Tue</span>
							<span>Wed</span>
							<span>Thu</span>
							<span>Fri</span>
							<span>Sat</span>
							<span>Sun</span>
						</div>
						{this.renderDays()}
					</div>
				</div>
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);