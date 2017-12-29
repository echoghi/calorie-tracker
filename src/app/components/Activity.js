import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
	activity: state.navigationState.activity
});

const mapDispatchToProps = dispatch => ({
	activatePage: page => dispatch(activatePage(page))
});

class Activity extends React.Component {
	state = {
		width: 0
	};

	componentWillMount() {
		let { reports, activatePage } = this.props;
		window.scrollTo(0, 0);

		if (!reports) {
			activatePage('activity');
		}
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="activity" />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
