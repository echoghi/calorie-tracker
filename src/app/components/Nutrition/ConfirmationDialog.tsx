import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const ConfirmationDialog = ({
    open,
    onClose,
    name,
    action
}: {
    open: boolean;
    onClose: () => void;
    name: string;
    action: () => void;
}) => {
    return (
        <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={onClose}>
            <DialogTitle>{`Remove ${name}?`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="subtitle1">
                        Are you sure you want to remove this entry?
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={action} color="primary" variant="contained">
                    Delete
                </Button>
                <Button onClick={onClose} color="primary" autoFocus={true}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
