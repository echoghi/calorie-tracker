import { createMuiTheme, Theme, createStyles } from '@material-ui/core/styles';

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
        error: { main: 'rgb(203, 36, 49)' },
        primary: { main: 'rgb(0, 132, 137)' },
        secondary: { main: '#FF5A5F' },
        text: {
            primary: '#3d575d',
            secondary: 'rgb(38, 122, 167)'
        }
    },
    typography: {
        fontFamily: [
            'Varela Round',
            'Source Sans Pro',
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
        useNextVariants: true
    }
});

export const styles = (theming: Theme) =>
    createStyles({
        bootstrapFormLabel: {
            color: '#3d575d',
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
            width: '100%'
        },
        selectLabel: {
            fontSize: 18,
            top: '-8px'
        }
    });
