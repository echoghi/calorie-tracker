import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { saveUserData, fetchData } from '../actions';
import { auth, provider } from '../firebase.js';
import isEmpty from 'lodash.isempty';
import { Header, Container } from './styles';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    saveUserData: data => dispatch(saveUserData(data)),
    fetchData: id => dispatch(fetchData(id))
});

const Login = ({ saveUserData, history, userData, fetchData }) => {
    // unmount
    React.useEffect(() => {
        return () => {
            if (!isEmpty(userData)) {
                fetchData(userData.uid);
            }
        };
    }, []);

    function logIn() {
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;

            if (user) {
                saveUserData(user);
                history.push('/');
            }
        });
    }

    return (
        <Container>
            <Header>
                <h1>Welcome Back! Please Login</h1>
                <div style={{ width: '85%', margin: '0 auto' }}>
                    <Button
                        style={{ marginTop: 20 }}
                        fullWidth
                        className="login__button"
                        onClick={logIn}
                        color="primary"
                        variant="raised"
                    >
                        Login via Google
                    </Button>
                </div>
            </Header>
        </Container>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
