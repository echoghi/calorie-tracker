import React from 'react';
import { connect } from 'react-redux';
import { activatePage } from './actions';

const mapStateToProps = state => ({
    tracker: state.navigationState.tracker
});

const mapDispatchToProps = dispatch => ({
    activatePage: page => dispatch(activatePage(page))
});

class Settings extends React.Component {
	state = {
		width   : 0
	};

	componentWillMount() {
		let { settings, activatePage } = this.props;
		window.scrollTo(0, 0);

		if(!settings) {
			activatePage('settings');
		}
	}

	render() {
		return (
			<div classNames="settings">
				Settings
			</div>
		);
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);