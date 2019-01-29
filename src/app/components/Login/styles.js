import styled from 'styled-components';

const Container = styled.div`
    background: #eff3f6;
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.div`
    height: 200px;
    width: 450px;
    border-radius: 4px 4px 0 0;
    background: #ffffff;
    border: 1px solid #e6eaee;
    align-self: center;

    h1 {
        background: #f8fafc;
        border-bottom: 1px solid #e6eaee;
        font-size: 24px;
        font-weight: normal;
        text-align: center;
        margin: 0 auto;
        padding: 50px 0;
    }
`;

export { Header, Container };
