import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';

const DaySummary = ({ day, id, open, onClose }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{day}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                If you've got a smart watch or fitness tracker, you can add your workouts in the
                activity section. You can then track your personal bests and other stats via the
                overview section.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button component={Link} to={`/nutrition?d=${id}`} color="primary" autoFocus>
                View Nutrition
            </Button>
        </DialogActions>
    </Dialog>
);

export default DaySummary;
