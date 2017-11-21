import React from 'react';
import { connect } from 'react-redux';
import { handleNav } from './actions';

const mapStateToProps = state => ({
    data: state.adminState.data,
    home: state.navigationState.home,
    tracker: state.navigationState.tracker,
    calendar: state.navigationState.calendar,
    reports: state.navigationState.reports,
    settings: state.navigationState.settings
});

const mapDispatchToProps = dispatch => ({
    handleNav: page => dispatch(handleNav(page))
});

class NavBar extends React.Component {
	state = {
		width   : 0,
  		menuOpen: false,
  		mobile  : false
	};

	handleMenu = () => {
		this.setState({ menuOpen : !this.state.menuOpen });
	}

	navigate = page => {
		if(!this.props[page]) {
	    	this.props.handleNav(page);
	    }
	}

	handleHamburgerClass() {
		let className;

        if (this.state.menuOpen) {
            className = 'hamburger active';
        } else {
        	className = 'hamburger';
        }

        return className;
	}

	handleNavClass(name) {
        let className;

        if (this.props[name]) {
            className = 'active';
        } else {
        	className = '';
        }

        return className;
    }

    handleMenuClass() {
    	let className;

    	if(this.state.width < 760) {
	        if (this.state.menuOpen) {
	            className = 'navbar__menu active';
	        } else {
	        	className = 'navbar__menu collapsed';
        	}
        } else {
        	className = 'navbar__menu lg';
        }

        return className;
    }

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth});
	}

	render() {
		return (
			<div className="navbar">
				<div className="navbar__brand">
					<i className="icon-fire" />
				</div>
				<div className={this.handleHamburgerClass()} onClick={this.handleMenu}>
					<div />
					<div />
					<div />
				</div>
				<ul className={this.handleMenuClass()}>
					<li className={this.handleNavClass('home')} onClick={() => { this.navigate('home'); }}><i className="icon-home" /> Overview</li>
					<li className={this.handleNavClass('tracker')} onClick={() => { this.navigate('tracker'); }}><i className="icon-plus-circle" /> Tracker</li>
					<li className={this.handleNavClass('calendar')} onClick={() => { this.navigate('calendar'); }}><i className="icon-calendar" /> Calendar</li>
					<li className={this.handleNavClass('reports')} onClick={() => { this.navigate('reports'); }}><i className="icon-bar-chart" /> Reports</li> 
					<li className={this.handleNavClass('settings')} onClick={() => { this.navigate('settings'); }}><i className="icon-settings" /> Settings</li>
				</ul>
				<div className="navbar__top"> 
				</div>
			</div>
		);
	}

};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);