import React from 'react';
import DeleteAccountDialog from './DeleteAccountDialog';
import Button from '@material-ui/core/Button';
import { DeleteAccountWrapper, SettingsHeader, SettingsSubHeader } from './styles';

const DeleteAccount = ({}) => {
    const [deleteAccountDialog, setDeleteAccountDialog] = React.useState(false);

    function closeDeleteDialog() {
        setDeleteAccountDialog(false);
    }

    function openDeleteDialog() {
        setDeleteAccountDialog(true);
    }

    return (
        <React.Fragment>
            <DeleteAccountWrapper>
                <SettingsHeader>Delete Account</SettingsHeader>
                <SettingsSubHeader>
                    We do our best to give you a great experience - we'll be sad to see you leave
                    us.{' '}
                </SettingsSubHeader>

                <Button
                    style={{ background: '#cb2431', display: 'block' }}
                    color="primary"
                    variant="raised"
                    onClick={openDeleteDialog}
                >
                    Delete Account
                </Button>
            </DeleteAccountWrapper>

            <DeleteAccountDialog open={deleteAccountDialog} onClose={closeDeleteDialog} />
        </React.Fragment>
    );
};

export default DeleteAccount;
