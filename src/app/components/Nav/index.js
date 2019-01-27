import React from 'react';
import UserMenu from './UserMenu';
import styled from 'styled-components';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../actions';
import { auth } from '../firebase.js';
import SubNav from './SubNav';

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    loading: state.adminState.loading,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut())
});

const Brand = styled(NavLink)`
    position: relative;
    font-size: 50px;
    background: #fff;
    color: rgb(0, 132, 137);
    box-sizing: border-box;
    text-align: center;
    display: inline-block;
    padding: 15px 30px;
    cursor: pointer;
`;

const Name = styled.div`
    font-family: Oregano;
    cursor: pointer;
    font-size: 35px;
    color: rgb(0, 132, 137);
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    font-style: italic;
`;

const NavBar = ({ userData, path, logOut }) => {
    const logOutHandler = () => {
        auth.signOut().then(() => {
            logOut();
        });
    };

    return (
        <React.Fragment>
            {path !== '/login' && (
                <div className="navbar">
                    <Brand to="/">
                        <i className="icon-aperture" />
                    </Brand>
                    <Name>Doughboy</Name>
                    <UserMenu userData={userData} logOut={logOutHandler} />
                </div>
            )}
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
