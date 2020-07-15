import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import Firebase from '../firebase';
import { DeleteAccountWrapper, SettingsHeader, SettingsSubHeader, DeleteButton } from './styles';

const mapStateToProps = (state) => ({
    userData: state.adminState.userData,
});

const DeleteAccount = ({ userData }) => {
    const [dialog, setDialog] = React.useState(false);

    function deleteAccount() {
        const user = Firebase.auth.currentUser;

        user.delete()
            .then(() => {
                const userRef = Firebase.db.ref('users').child(userData.uid);

                userRef.on('value', (snapshot) => {
                    snapshot.ref.remove();
                    console.warn('User Account Deleted');

                    window.location.reload(true);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const openDialog = () => setDialog(true);
    const closeDialog = () => setDialog(false);

    return (
        <React.Fragment>
            <DeleteAccountWrapper>
                <SettingsHeader>Delete Account</SettingsHeader>
                <SettingsSubHeader>
                    We do our best to give you a great experience - we'll be sad to see you leave
                    us.
                </SettingsSubHeader>

                <DeleteButton onClick={openDialog}>Delete Account</DeleteButton>
            </DeleteAccountWrapper>

            <Dialog open={dialog} onClose={closeDialog}>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account? All of your data will be
                        permanently deleted from our database.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <DeleteButton onClick={deleteAccount} variant="contained">
                        Delete
                    </DeleteButton>
                    <Button onClick={closeDialog} color="primary" autoFocus={true}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps)(DeleteAccount);
