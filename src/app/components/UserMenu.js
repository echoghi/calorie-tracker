import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Menu = styled.ul`
    position: absolute;
    width: 200px;
    font-family: 'Varela Round';
    margin-top: 9px;
    background: #fff;
    list-style: none;
    padding: 15px;
    right: 25px
    border: 1px solid #dbdbdb;
    border-radius:  0 0 4px 4px;

    li {
        padding: 10px;
        border-top: 1px solid rgb(242, 242, 242);

        &:hover {
            border-top: 1px solid #dbdbdb;
        }
    }
`;

class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleMenu = () => {
        this.setState({ open: !this.state.open });
    };

    renderMenu() {
        if (this.state.open) {
            return (
                <Menu className="logout__button" onClose={() => this.setState({ open: false })}>
                    <li>
                        <Link to="settings">Account Settings</Link>
                    </li>
                    <li>
                        <Link to="settings">Edit Profile</Link>
                    </li>
                    <li onClick={this.logOut}>Log Out</li>
                </Menu>
            );
        }
    }

    render() {
        const { userData } = this.props;

        return (
            <div className="greeting">
                <div onClick={this.handleMenu}>
                    <img className="user__img" src={userData.photoURL} />
                </div>

                {this.renderMenu()}
            </div>
        );
    }
}

export default UserMenu;
