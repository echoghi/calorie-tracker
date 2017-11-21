import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
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
		width   : 0
	};

	componentWillMount() {
		let { calendar, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!calendar) {
			activatePage('calendar');
		}
	}

	render() {
		return (
			<div>
				Calendar
				<NavBar />
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);