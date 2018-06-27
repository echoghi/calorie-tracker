import React from 'react';
import styled from 'styled-components';

const Text = styled.span`
    font-size: 1rem;
    height: 15px;
    padding: 0;
    margin: 5px 0;
`;

const Container = styled.div`
    width: 80%;
    margin: 0 auto;
`;

const Bar = styled.div`
    position: relative;

    &:first-child {
        transition: 0.4s linear;
        transition-property: width, background-color;
    }
`;

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hello: false
        };
    }

    renderBarBackground(progress, options) {
        if (progress > 1) {
            return `repeating-linear-gradient(135deg, ${options.color}, ${
                options.color
            } 10px, #5e639a 10px, #5e639a 20px`;
        } else {
            return options.color;
        }
    }

    render() {
        const { options, progress } = this.props;

        return (
            <div style={{ width: `${options.containerStyle.width}`, margin: `${options.containerStyle.margin}` }}>
                <Container style={{ height: `${options.height}px`, maxHeight: `${options.height}px`, width: '100%' }}>
                    <Bar
                        style={{
                            height: '100%',
                            width: progress > 1 ? '100%' : `${progress * 100}%`,
                            background: this.renderBarBackground(progress, options),
                            marginBottom: `-${options.height}px`,
                            zIndex: '2'
                        }}
                    />
                    <Bar
                        style={{
                            width: '100%',
                            height: `${options.height}px`,
                            background: options.trailColor
                        }}
                    />
                </Container>
                <Text style={options.text.style}>{options.text.value}</Text>
            </div>
        );
    }
}

export default ProgressBar;
