const config = {
    app: {
        name: 'Doughboy',
        version: 1,
    },
    palette: {
        error: 'rgb(203, 36, 49)',
        macros: {
            calorie: {
                color: '#ffab3e',
                trailColor: '#FFE9C6',
            },
            carbs: {
                color: '#5b6aee',
                trailColor: '#D0D4FA',
            },
            fat: {
                color: '#f08ec1',
                trailColor: '#FCDFED',
            },
            protein: {
                color: '#32c9d5',
                trailColor: '#E6FDF3',
            },
        },
        primary: 'rgb(0, 132, 137)',
        secondary: '#FF5A5F',
        text: {
            primary: '#3d575d',
            secondary: 'rgb(38, 122, 167)',
        },
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
            '"Segoe UI Symbol"',
        ],
    },
};

export default config;
