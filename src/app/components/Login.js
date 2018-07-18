import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { saveUserData, fetchData } from './actions';
import { auth, provider } from './firebase.js';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    saveUserData: data => dispatch(saveUserData(data)),
    fetchData: id => dispatch(fetchData(id))
});

class Login extends React.Component {
    logIn = () => {
        const { saveUserData, history } = this.props;

        auth.signInWithPopup(provider).then(result => {
            const user = result.user;

            if (user) {
                saveUserData(user);
                history.push('/');
            }
        });
    };

    componentWillUnmount() {
        const { userData, fetchData } = this.props;

        if (!_.isEmpty(userData)) {
            fetchData(userData.uid);
        }
    }

    render() {
        return (
            <div className="login__container">
                <div className="login__header">
                    <h1>Welcome Back! Please Login</h1>
                    <div style={{ width: '85%', margin: '0 auto' }}>
                        <Button
                            style={{ marginTop: 20 }}
                            fullWidth
                            className="login__button"
                            onClick={this.logIn}
                            color="primary"
                            variant="raised"
                        >
                            Login via Google
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
