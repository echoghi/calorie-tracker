import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './MaterialTheme';

function Input({ classes, multiline, ...props }) {
    return (
        <TextField
            {...props}
            InputProps={{
                disableUnderline: true,
                classes: {
                    root: classes.bootstrapRoot,
                    input: multiline ? classes.bootstrapInputMulti : classes.bootstrapInput
                }
            }}
            InputLabelProps={{
                shrink: true,
                className: classes.bootstrapFormLabel
            }}
        />
    );
}

export default withStyles(styles)(Input);
