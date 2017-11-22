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
	state = {
		time: moment()
	};

	componentWillMount() {
		let { calendar, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!calendar) {
			activatePage('calendar'); 
		}
	}

	handleDayClass(day) {
		let { time } = this.state;
		let now = moment();

		if(now.date() === day.date() && now.month() === day.month() && now.year() === day.year()) {
			return 'day today';
		} else if(day.month() !== time.month()) {
			return 'day inactive';
		} else {
			return 'day';
		}
	}

	renderDays() {
		let { time } = this.state;
		let calendarDays = [];
		let calendar = [];
		const startWeek = time.startOf('month').week();
		const endWeek = time.endOf('month').week();

		for(let week = startWeek; week <= endWeek; week++) {
			calendar.push({
				week: week,
				days: Array(7).fill(0).map((n, i) => time.week(week).startOf('week').clone().add(n + i, 'day'))
			});
		}

		for(let i = 0; i < calendar.length; i++) {
			for(let j = 0; j < calendar[i].days.length; j++) {
				calendarDays.push(<div className={this.handleDayClass(calendar[i].days[j])} key={`${calendar[i].days[j].date()}-${calendar[i].days[j].get('month')}`}>
									<div className="number">{calendar[i].days[j].date()}</div>
								</div>);
			}
		}

		return calendarDays;
	}

	changeMonth(bool) {
		let { time } = this.state;

		if(bool) {
			if(time.date() === 11) {
				time = moment([time.get('year') + 1, 0, time.date()]);
			} else {
				time = moment([time.get('year'), time.get('month') + 1, time.date()]);
			}
		} else {
			if(time.date() === 0) {
				time = moment([time.get('year') - 1, 13, time.date()]);
			} else {
				time = moment([time.get('year'), time.get('month') - 1, time.date()]);
			}
		}
		console.log(time.get('year'), time.get('month'), time.date());
		this.setState({ time });
	}

	render() {
		let month = this.state.time.format('MMMM');

		return (
			<div>
				<NavBar />
				<div className="calendar">
					<h1>Calendar</h1>
					<div className="calendar__toggle--month">
						<i className="icon-chevron-left" onClick={() => this.changeMonth(false)} />
						<h2>{month}</h2>
						<i className="icon-chevron-right" onClick={() => this.changeMonth(true)} />
					</div>
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