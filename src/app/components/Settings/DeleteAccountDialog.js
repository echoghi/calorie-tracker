import React from 'react';
import { connect } from 'react-redux';
import { database, auth } from '../firebase.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const DeleteAccountDialog = ({ open, onClose, userData }) => {
    function deleteAccount() {
        const user = auth.currentUser;

        user.delete()
            .then(() => {
                const userRef = database.ref('users').child(userData.uid);

                userRef.on('value', snapshot => {
                    snapshot.ref.remove();
                    window.location.reload(true);
                });

                console.log('User Account Deleted');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this account? All of your data will be
                    permanently deleted from our database.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    style={{ background: '#cb2431', color: 'white' }}
                    onClick={deleteAccount}
                    variant="raised"
                >
                    Delete
                </Button>
                <Button onClick={onClose} color="primary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default connect(mapStateToProps)(DeleteAccountDialog);
