import React from 'react';
import { NotFound } from './styles';

interface State {
    error: Error | null | undefined;
    info: object | null | undefined;
}

class ErrorBoundary extends React.Component<{}, State> {
    state: State = {
        error: null,
        info: null
    };

    componentDidCatch(error: Error, info: object) {
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
