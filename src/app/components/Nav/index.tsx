import React from 'react';
import UserMenu from './UserMenu';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Nav, Brand, Name } from './styles';
import { connect } from 'react-redux';
import { logOut } from '../actions';
import Firebase from '../firebase';
import SubNav from './SubNav';
import { Dispatch } from 'redux';
import firebase from 'firebase';

interface AdminState {
    data: {};
    day: {
        day: {};
        todayButton: boolean;
        formattedDay: {};
        requestedDate: boolean;
        dayRef: {};
        dayIndex: 0;
    };
    error: boolean;
    userData: firebase.UserInfo | {};
    userLoading: boolean;
    loading: boolean;
    success: boolean;
}

interface Queue {
    duration: number;
    key: number;
    message: string;
    type: string;
}

interface NotificationState {
    queue: Queue[];
    open: boolean;
    duration: number;
    message: string;
    type: string;
}

interface NavBar extends RouteComponentProps {
    appLogOut: () => void;
    userData: firebase.UserInfo | {};
}

interface RootState {
    notificationState: NotificationState;
    adminState: AdminState;
}

const mapStateToProps = (state: RootState) => ({
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    appLogOut: () => dispatch(logOut())
});

const NavBar = ({ userData, appLogOut }: NavBar) => {
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
