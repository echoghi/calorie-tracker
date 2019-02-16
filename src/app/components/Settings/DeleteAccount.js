import React from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { DeleteAccountWrapper, SettingsHeader, SettingsSubHeader } from './styles';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const DeleteAccount = ({ userData }) => {
    const [dialog, setDialog] = React.useState(false);

    function deleteAccount() {
        const user = Firebase.auth.currentUser;

        user.delete()
            .then(() => {
                const userRef = Firebase.db.ref('users').child(userData.uid);

                userRef.on('value', snapshot => {
                    snapshot.ref.remove();
                    console.warn('User Account Deleted');

                    window.location.reload(true);
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <React.Fragment>
            <DeleteAccountWrapper>
                <SettingsHeader>Delete Account</SettingsHeader>
                <SettingsSubHeader>
                    We do our best to give you a great experience - we'll be sad to see you leave
                    us.
                </SettingsSubHeader>

                <Button
                    style={{ background: '#cb2431', display: 'block' }}
                    color="primary"
                    variant="contained"
                    onClick={() => setDialog(true)}
                >
                    Delete Account
                </Button>
            </DeleteAccountWrapper>

            <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account? All of your data will be
                        permanently deleted from our database.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        style={{ background: '#cb2431', color: '#FFFFFF' }}
                        onClick={deleteAccount}
                        variant="contained"
                    >
                        Delete
                    </Button>
                    <Button onClick={() => setDialog(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps)(DeleteAccount);
