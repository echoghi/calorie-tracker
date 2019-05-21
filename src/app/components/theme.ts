import { createMuiTheme, Theme, createStyles } from '@material-ui/core/styles';
import config from '../../config';

export const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                fontFamily: 'Roboto',
                fontSize: 14,
                height: 40
            }
        },
        MuiDialogActions: {
            root: {
                padding: '0 16px 16px 0'
            }
        }
    },
    palette: {
        error: { main: config.palette.error },
        primary: { main: config.palette.primary },
        secondary: { main: config.palette.secondary },
        text: {
            primary: config.palette.text.primary,
            secondary: config.palette.text.secondary
        }
    },
    typography: {
        fontFamily: config.typography.fontFamily.join(','),
        fontSize: 16,
        useNextVariants: true
    }
});

export const styles = (theming: Theme) =>
    createStyles({
        bootstrapFormLabel: {
            color: config.palette.text.primary,
            fontSize: 18
        },
        bootstrapInput: {
            '&:focus': {
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
            },
            backgroundColor: theming.palette.common.white,
            border: '1px solid #ced4da',
            borderRadius: 4,
            boxSizing: 'border-box',
            fontSize: 16,
            height: 40,
            padding: '10px 12px',
            transition: theming.transitions.create(['border-color', 'box-shadow'])
        },
        bootstrapInputMulti: {
            '&:focus': {
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
            },
            backgroundColor: theming.palette.common.white,
            border: '1px solid #ced4da',
            borderRadius: 4,
            boxSizing: 'border-box',
            fontSize: 16,
            padding: '10px 12px',
            transition: theming.transitions.create(['border-color', 'box-shadow'])
        },
        bootstrapRoot: {
            'label + &': {
                marginTop: theming.spacing.unit * 3
            },
            padding: 0
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        cssFocused: {},
        margin: {
            margin: theming.spacing.unit
        },
        select: {
            '&:focus': {
                backgroundColor: 'white',
                borderColor: '#80bdff',
                borderRadius: 4,
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
            },
            backgroundColor: theming.palette.common.white,
            border: '1px solid #ced4da',
            borderRadius: 4,
            boxSizing: 'border-box',
            fontSize: 16,
            height: 40,
            padding: '10px 12px',
            transition: theming.transitions.create(['border-color', 'box-shadow']),
            width: '100%'
        },
        selectLabel: {
            color: config.palette.text.primary,
            fontSize: 18,
            top: '-8px'
        }
    });
