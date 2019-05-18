import { createMuiTheme, Theme, createStyles } from '@material-ui/core/styles';

export const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
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
        primary: { main: 'rgb(0, 132, 137)' },
        secondary: { main: '#FF5A5F' }
    },
    typography: {
        useNextVariants: true
    }
});

export const styles = (theming: Theme) =>
    createStyles({
        bootstrapFormLabel: {
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
            fontSize: 16,
            height: 40,
            padding: '10px 12px',
            transition: theming.transitions.create(['border-color', 'box-shadow']),
            width: 200
        },
        selectLabel: {
            fontSize: 18,
            top: '-8px'
        }
    });
