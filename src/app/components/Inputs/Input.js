import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../theme';

function Input({ classes, adornment, name, ...props }) {
    return (
        <TextField
            {...props}
            InputProps={{
                classes: {
                    input: props.multiline ? classes.bootstrapInputMulti : classes.bootstrapInput,
                    root: classes.bootstrapRoot,
                },
                disableUnderline: true,
                endAdornment: adornment,
                label: name,
            }}
            InputLabelProps={{
                className: classes.bootstrapFormLabel,
                shrink: true,
            }}
        />
    );
}

export default withStyles(styles)(Input);
