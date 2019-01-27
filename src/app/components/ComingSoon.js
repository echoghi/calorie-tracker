import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
    position: fixed;
    top: 50%;
    left: 40%;
    font-size: 60px;

    @media (max-width: 1023px) {
        height: 100%;
        width: 100%;
        display: flex;
        position: fixed;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        left: 0;
        top: 0;
    }
`;

const ComingSoon = () => (
    <Banner>{this.props.width < 1024 ? 'Mobile Experience coming soon.' : 'Coming Soon!'}</Banner>
);

export default ComingSoon;
