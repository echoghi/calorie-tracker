import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './MaterialTheme';

function Input(props) {
    const {
        classes,
        required,
        defaultValue,
        label,
        id,
        style,
        type,
        error,
        onChange,
        multiline,
        rows,
        fullWidth
    } = props;

    return (
        <TextField
            defaultValue={defaultValue || ''}
            label={label}
            id={id}
            type={type}
            error={error}
            required={required}
            onChange={onChange}
            multiline={multiline}
            fullWidth={fullWidth}
            rows={rows}
            InputProps={{
                disableUnderline: true,
                classes: {
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                }
            }}
            InputLabelProps={{
                shrink: true,
                className: classes.bootstrapFormLabel
            }}
            style={style}
        />
    );
}

export default withStyles(styles)(Input);
