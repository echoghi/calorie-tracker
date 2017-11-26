import React from 'react';
import { connect } from 'react-redux';
import { activatePage, handleNav, loadNutritionData } from './actions';
import moment from 'moment';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    calendar: state.navigationState.calendar,
    data: state.adminState.data
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page)),
    handleNav: page => dispatch(handleNav(page)),
    loadNutritionData: data => dispatch(loadNutritionData(data))
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

	navigateToNutrition(day) {
		let { data, handleNav, loadNutritionData } = this.props;
		let dayData;

		for(let i = 0; i < data.calendar.length; i++) {
			if(data.calendar[i].day.date() === day.date() && data.calendar[i].day.month() === day.month() && data.calendar[i].day.year() === day.year()) {
				dayData = data.calendar[i];
			}
		}

		loadNutritionData(dayData);
		handleNav('nutrition');
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

	handleIconClass(day) {
		let now = moment();
		let { data } = this.props;
		let dayData;

		for(let i = 0; i < data.calendar.length; i++) {
			if(data.calendar[i].day.date() === day.date() && data.calendar[i].day.month() === day.month() && data.calendar[i].day.year() === day.year()) {
				dayData = data.calendar[i];
			}
		}

		if(now.date() >= day.date() && now.month() >= day.month() && now.year() >= day.year() && dayData) {
			return 'icon-info';
		} else {
			return 'icon-info hidden';
		}
	}

	renderDays() {
		let { time } = this.state;
		let calendarDays = [];
		let calendar = [];
		let startWeek = time.clone().startOf('month').week();
		let endWeek = time.clone().endOf('month').week();

		if(startWeek > endWeek) {
			calendar = [
				{
					week: 48,
					days: Array(7).fill(0).map((n, i) => time.week(48).startOf('week').clone().add(n + i, 'day'))
				},
				{
					week: 49,
					days: Array(7).fill(0).map((n, i) => time.week(49).startOf('week').clone().add(n + i, 'day'))
				},
				{
					week: 50,
					days: Array(7).fill(0).map((n, i) => time.week(50).startOf('week').clone().add(n + i, 'day'))
				},
				{
					week: 51,
					days: Array(7).fill(0).map((n, i) => time.week(51).startOf('week').clone().add(n + i, 'day'))
				},
				{
					week: 52,
					days: Array(14).fill(0).map((n, i) => time.week(52).startOf('week').clone().add(n + i, 'day'))
				}
			];
		} else {
			for(let week = startWeek; week <= endWeek; week++) {
				calendar.push({
					week: week,
					days: Array(7).fill(0).map((n, i) => time.week(week).startOf('week').clone().add(n + i, 'day'))
				});
			}
		}

		for(let i = 0; i < calendar.length; i++) {
			for(let j = 0; j < calendar[i].days.length; j++) {
				calendarDays.push(<div className={this.handleDayClass(calendar[i].days[j])} key={`${calendar[i].days[j].date()}-${calendar[i].days[j].get('month')}-${Math.random()}`}>
									<div className="number">{calendar[i].days[j].date()}</div>
									<span onClick={() => this.navigateToNutrition(calendar[i].days[j])} className={this.handleIconClass(calendar[i].days[j])} />
								</div>);
			}
		}

		return calendarDays;
	}

	changeMonth(bool) {
		let { time } = this.state;
		time = time.clone();

		if(bool) {
			if(time.get('month') === 11) {
				time = moment([time.get('year') + 1, 0, 1]);
			} else {
				time = moment([time.get('year'), time.get('month') + 1, 1]);
			}
		} else {
			if(time.get('month') === 0) {
				time = moment([time.get('year') - 1, 11, 1]);
			} else {
				time = moment([time.get('year'), time.get('month') - 1, 1]);
			}
		}

		this.setState({ time });
	}

	render() {
		let month = this.state.time.format('MMMM');
		let year = this.state.time.format('YYYY');

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
					<h4>{year}</h4>
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