import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

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

        &:first-child {
            border-top: 0
        }

        &:hover {
            opacity: .8;
        }
    }
`;

class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.menuRef && !this.menuRef.contains(event.target)) {
            this.setState({ open: false });
        }
    };

    handleMenu = () => {
        this.setState({ open: !this.state.open });
    };

    renderMenu() {
        const { open } = this.state;

        if (open) {
            return (
                <div
                    ref={node => {
                        this.menuRef = node;
                    }}
                >
                    <Fade in={open}>
                        <Menu className="logout__button" onClose={() => this.setState({ open: false })}>
                            <li>
                                <Link to="settings">Account Settings</Link>
                            </li>
                            <li>
                                <Link to="settings">Edit Profile</Link>
                            </li>
                            <li onClick={this.props.logOut}>Log Out</li>
                        </Menu>
                    </Fade>
                </div>
            );
        }
    }

    render() {
        const { userData } = this.props;

        return (
            <div className="greeting">
                <div onClick={this.handleMenu}>
                    <img className="user__img" src={userData.photoURL} />
                    <i className="icon-chevron-down" />
                </div>

                {this.renderMenu()}
            </div>
        );
    }
}

export default UserMenu;