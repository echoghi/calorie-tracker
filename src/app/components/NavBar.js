import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { handleNav } from './actions';
import { auth, provider } from './firebase.js';

const mapStateToProps = state => ({
    data: state.adminState.data,
    home: state.navigationState.home,
    nutrition: state.navigationState.nutrition,
    calendar: state.navigationState.calendar,
    activity: state.navigationState.activity,
    settings: state.navigationState.settings
});

const mapDispatchToProps = dispatch => ({
    handleNav: page => dispatch(handleNav(page))
});

class NavBar extends React.Component {
	state = {
		width   : 0,
  		menuOpen: false,
  		mobile  : false,
  		user: null
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
		auth.onAuthStateChanged(user => {
		    if (user) {
	      		this.setState({ user });
		    } 
	  	});

		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth});
	}

	logIn = () => {
		auth.signInWithPopup(provider) 
	    .then((result) => {
			const user = result.user;
			this.setState({
				user
			});
	    });
	}

	logOut = () => {
		auth.signOut()
		.then(() => {
			this.setState({
				user: null
			});
		});
	}

	renderUserMenu() {
		if(!this.state.user) {
			return (<RaisedButton
                    label="Login"
                    className="login__button"
                    onClick={this.logIn}
                    backgroundColor="#ed5454"
                    labelColor="#fff"
                />);
		} else {
			return (<RaisedButton
                    label="Logout"
                    className="logout__button"
                    onClick={this.logOut}
                    backgroundColor="#ed5454"
                    labelColor="#fff"
                />);

		}
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
					<li className={this.handleNavClass('calendar')} onClick={() => { this.navigate('calendar'); }}><i className="icon-calendar" /> Calendar</li>
					<li className={this.handleNavClass('nutrition')} onClick={() => { this.navigate('nutrition'); }}><i className="icon-plus-circle" /> Nutrition</li>
					<li className={this.handleNavClass('activity')} onClick={() => { this.navigate('activity'); }}><i className="icon-bar-chart" /> Activity</li> 
					<li className={this.handleNavClass('settings')} onClick={() => { this.navigate('settings'); }}><i className="icon-settings" /> Settings</li>
				</ul>
				<div className="navbar__top"> 
					{this.renderUserMenu()}
				</div>
			</div>
		);
	}

};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);