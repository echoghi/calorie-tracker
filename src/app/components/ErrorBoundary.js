import React from 'react';

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
        const { hasError, info } = this.state;
        let errorText = info ? info.componentStack : '';

        if (errorText) {
            errorText = errorText.split('\n');
        }

        if (hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error__container">
                    <div className="error__header">
                        <div />
                        <div />
                        <div />
                    </div>
                    <div className="error__list">
                        {_.map(errorText, (line, index) => {
                            if (line) {
                                return (
                                    <p className="error__message" key={index}>
                                        $ {line}
                                    </p>
                                );
                            }
                        })}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
