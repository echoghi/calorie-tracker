import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    reports: state.navigationState.reports
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Reports extends React.Component {
	state = {
		width   : 0
	};

	componentWillMount() {
		let { reports, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!reports) {
			activatePage('reports');
		}
	}

	render() {
		return (
			<div>
				<NavBar />
				<div className="reports">
				</div>
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);