import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    tracker: state.navigationState.tracker
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Tracker extends React.Component {
	state = {
		width   : 0
	};

	componentWillMount() {
		let { tracker, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!tracker) {
			activatePage('tracker');
		}
	}

	render() {
		return (
			<div>
				<NavBar />
				Tracker
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);