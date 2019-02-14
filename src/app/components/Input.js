import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './MaterialTheme';

function Input(props) {
    return (
        <TextField
            {...props}
            InputProps={{
                disableUnderline: true,
                classes: {
                    root: props.classes.bootstrapRoot,
                    input: props.multiline
                        ? props.classes.bootstrapInputMulti
                        : props.classes.bootstrapInput
                }
            }}
            InputLabelProps={{
                shrink: true,
                className: props.classes.bootstrapFormLabel
            }}
        />
    );
}

export default withStyles(styles)(Input);
