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

class Settings extends React.Component {
	state = {
		width   : 0
	};

	render() {
		return (
			<div>
				<NavBar />
			</div>
		);
	}

};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);