import React from 'react';
import { Text, BarWrapper, Progress, Trail } from './styles';
import styled from 'styled-components';

interface Bar {
    progress: number;
    options: {
        height: number;
        trailColor: string;
        color: string;
        text: string;
        containerStyle: React.CSSProperties;
    };
}

const Bar = ({ options, progress }: Bar) => {
    function renderBarBackground() {
        if (progress > 1) {
            return `repeating-linear-gradient(135deg, ${options.color}, ${
                options.color
            } 10px, #5e639a 10px, #5e639a 20px`;
        } else {
            return options.color;
        }
    }

    const Container = styled.div`
        width: ${options.containerStyle.width};
        margin: ${options.containerStyle.margin};

        @media (max-width: 768px) {
            margin: 0 auto;
        }
    `;

    return (
        <Container>
            <BarWrapper height={options.height}>
                <Progress
                    height={options.height}
                    style={{
                        background: renderBarBackground(),
                        width: progress > 1 ? '100%' : `${progress * 100}%`
                    }}
                />
                <Trail height={options.height} color={options.trailColor} />
            </BarWrapper>
            <Text>{options.text}</Text>
        </Container>
    );
};

export default Bar;
