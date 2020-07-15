import React from 'react';
import { NotFound } from './styles';

class ErrorBoundary extends React.Component {
    state = {
        error: null,
        info: null,
    };

    componentDidCatch(error, info) {
        this.setState({ error, info });
    }

    render() {
        if (this.state.error) {
            return (
                <NotFound>
                    <h1>Oops! </h1>
                    <p>💀 Something went wrong 💀</p>
                    <a href=".">Refresh page</a>
                </NotFound>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
