import React from 'react';
import styled from 'styled-components';
// Images
import errorImg from '../assets/images/error.png';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    position: fixed;
    alignitems: center;
    justifycontent: center;
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
                <Wrapper>
                    <img src={errorImg} />
                </Wrapper>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
