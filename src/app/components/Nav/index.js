import React from 'react';
import UserMenu from './UserMenu';
import { withRouter } from 'react-router-dom';
import { Nav, Brand, Name } from './styles';
import { connect } from 'react-redux';
import { logOut } from '../actions';
import Firebase from '../firebase.js';
import SubNav from './SubNav';

const mapStateToProps = state => ({
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = dispatch => ({
    appLogOut: () => dispatch(logOut())
});

const NavBar = ({ userData, appLogOut }) => {
    const logOutHandler = () => {
        Firebase.auth.signOut().then(() => {
            appLogOut();
        });
    };

    return (
        <React.Fragment>
            <Nav>
                <Brand to="/">
                    <i className="icon-aperture" />
                </Brand>
                <Name>Doughboy</Name>
                <UserMenu userData={userData} logOut={logOutHandler} />
            </Nav>

            <SubNav />
        </React.Fragment>
    );
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(NavBar)
);
