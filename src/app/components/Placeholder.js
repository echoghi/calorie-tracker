import React from 'react';
import styled from 'styled-components';

class Placeholder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            info: null
        };
    }

    render() {
        const { style, circle } = this.props;
        const { height, width, borderRadius } = style;

        const Loader = styled.div`
            height: ${height};
            width: ${width};
            borderradius: ${circle ? '50%' : borderRadius};
        `;

        return <Loader />;
    }
}

export default Placeholder;
