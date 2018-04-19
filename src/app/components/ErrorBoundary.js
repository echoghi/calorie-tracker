import React from 'react';
// Images
import errorImg from '../assets/images/error.png';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            info: null
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error__container">
                    <img src={errorImg} />
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
