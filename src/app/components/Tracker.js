import React from 'react';
import { connect } from 'react-redux';
// Components
import NavBar from './NavBar';

const mapStateToProps = state => ({
    data: state.adminState.data
});

const mapDispatchToProps = dispatch => ({
    handleNav: page => dispatch(handleNav(page))
});

class Tracker extends React.Component {
	state = {
		width   : 0
	};

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