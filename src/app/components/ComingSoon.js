import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
    position: fixed;
    top: 50%;
    left: 40%;
    font-size: 60px;
`;

class ComingSoon extends React.Component {
    render() {
        return <Banner>Coming Soon!</Banner>;
    }
}

export default ComingSoon;
