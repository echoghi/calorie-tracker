import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './theme';

interface Input {
    classes: any;
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
                classes: {
                    input: multiline ? classes.bootstrapInputMulti : classes.bootstrapInput,
                    root: classes.bootstrapRoot
                },
                disableUnderline: true
            }}
            InputLabelProps={{
                className: classes.bootstrapFormLabel,
                shrink: true
            }}
        />
    );
}

export default withStyles(styles)(Input);
