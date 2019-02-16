import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './theme';
import { Classes } from 'jss';

interface Input {
    classes: Classes;
    multiline?: boolean;
    rows?: string;
    label: string;
    name: string;
    id?: string;
    error?: boolean;
    required?: boolean;
    value: string | number;
    type?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

function Input({ classes, multiline, ...props }: Input) {
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
