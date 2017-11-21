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

	handleDayClass(day) {
		let now = moment();

		if(now.date() === day.date()) {
			return 'day today';
		} else if(day.month() !== now.month()) {
			return 'day inactive';
		} else {
			return 'day';
		}
	}

	renderDays() {
		let calendarDays = [];
		let calendar = [];
		const startWeek = moment().startOf('month').week();
		const endWeek = moment().endOf('month').week();

		for(let week = startWeek; week < endWeek; week++){
		  calendar.push({
		    week: week,
		    days: Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day'))
		  });
		}

		for(let i = 0; i < calendar.length; i++) {
			for(let j = 0; j < calendar[i].days.length; j++) {
				calendarDays.push(<div className={this.handleDayClass(calendar[i].days[j])} key={calendar[i].days[j].date()}>
									<div className="number">{calendar[i].days[j].date()}</div>
								</div>);
			}
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
							<span>Sun</span>
							<span>Mon</span>
							<span>Tue</span>
							<span>Wed</span>
							<span>Thu</span>
							<span>Fri</span>
							<span>Sat</span>
						</div>
						{this.renderDays()}
					</div>
				</div>
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);