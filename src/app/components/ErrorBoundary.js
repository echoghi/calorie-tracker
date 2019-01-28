import React from 'react';
import styled from 'styled-components';

const NotFound = styled.div`
    position: relative;
    padding: 15rem 1.5rem;
    margin: 15% auto;
    text-align: left;
    max-width: 36.4rem;
    height: 100px;
    p {
        font-size: 16px;
    }
    a {
        font-weight: bold;
    }
    @media (max-width: 767px) {
        padding: 10rem 1.5rem;
    }
`;

class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
        error: null,
        info: null
    };

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    render() {
        if (this.state.hasError) {
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
