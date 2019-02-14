import React from 'react';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import * as loadingAnimation from '../../assets/animations/loading.json';

const LoadingWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
`;

const Loading = () => {
    const options = {
        animationData: loadingAnimation,
        autoplay: true,
        loop: true,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true
        }
    };

    return (
        <LoadingWrapper>
            <Lottie options={options} height={300} width={300} />
        </LoadingWrapper>
    );
};

export default Loading;
