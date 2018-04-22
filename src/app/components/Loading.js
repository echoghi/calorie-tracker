import React from 'react';
import Lottie from 'react-lottie';
import * as loadingAnimation from '../assets/animations/loading.json';

class Loading extends React.Component {
    render() {
        const options = {
            loop: true,
            autoplay: true,
            animationData: loadingAnimation,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
                progressiveLoad: true
            }
        };

        return (
            <div
                style={{
                    margin: '20% auto'
                }}
            >
                <Lottie options={options} height={300} width={300} />
            </div>
        );
    }
}

export default Loading;
