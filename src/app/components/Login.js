import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
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
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;
            this.props.saveUserData(user);
            this.props.history.push('/');
        });
    };

    componentWillUnmount() {
        const { userData, fetchData } = this.props;

        fetchData(userData.uid);
    }

    render() {
        return (
            <div className="login__container">
                <div className="login__header">
                    <h1>Welcome Back! Please Login</h1>
                    <div style={{ width: '85%', margin: '0 auto' }}>
                        <RaisedButton
                            label="Login via Google"
                            style={{ marginTop: 20 }}
                            fullWidth
                            className="login__button"
                            onClick={this.logIn}
                            primary
                            labelColor="#fff"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
