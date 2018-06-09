import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    margin: {
        margin: theme.spacing.unit
    },

    cssFocused: {},

    bootstrapRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing.unit * 3
        }
    },
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
        }
    },
    bootstrapFormLabel: {
        fontSize: 18
    }
});

function Input(props) {
    const { classes, defaultValue, label, id, style } = props;

    return (
        <TextField
            defaultValue={defaultValue || ''}
            label={label}
            id={id}
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
