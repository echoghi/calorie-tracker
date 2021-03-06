import styled from 'styled-components';
import { Link } from 'react-router-dom';

import config from '@config';

const Container = styled.div`
    background: rgb(250, 250, 250);
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.div`
    font-size: 40px;
    font-weight: normal;
    font-family: Oregano;
    font-style: italic;
    text-align: center;
    font-weight: bold;
    margin: 0 auto;
    padding: 40px 25px 0 25px;
    color: rgb(0, 132, 137);
`;

const SubHeader = styled.p`
    font-size: 14px;
    font-weight: normal;
    padding: 25px 25px 0;
    margin: 0;
`;

const GButtonContent = styled.div`
    display: flex;
    justify-content: space-between;
`;

const GButtonIcon = styled.svg`
    position: absolute;
    top: 10px;
    left: 10px;
`;

const FButtonIcon = styled.svg`
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgb(59, 89, 152);
    fill: rgb(255, 255, 255);
`;

const Adornment = styled.div`
    transform: translateX(-10px);
`;

const Divider = styled.div`
    margin: 20px 0;
    text-align: center;
    height: 1px;
    background: ${config.palette.primary};
    line-height: 0;

    span {
        background: #fff;
        padding: 5px;
    }
`;

const Wrapper = styled.div`
    width: 400px;
    border-radius: 4px 4px 0 0;
    background: #ffffff;
    align-self: center;

    @media (max-width: 768px) {
        width: 350px;
    }
`;

const Form = styled.form`
    padding: 25px;
`;

const ErrorMessage = styled.span`
    padding: 5px 0;
    color: rgb(203, 36, 49);
`;

const SignUpLink = styled(Link)`
    color: rgb(0, 132, 137);
`;

const BackToLogin = styled(Link)`
    text-decoration: underline;
`;

const SignUpText = styled.span`
    padding-right: 10px;
`;

const SignUp = styled.div`
    display: flex;
    margin-top: 25px;
`;

const LoginFooter = styled.div`
    display: flex;
    justify-content: space-between;
`;

export {
    Header,
    Container,
    Form,
    Wrapper,
    ErrorMessage,
    Adornment,
    SignUpLink,
    FButtonIcon,
    GButtonContent,
    GButtonIcon,
    SignUpText,
    Divider,
    SignUp,
    BackToLogin,
    LoginFooter,
    SubHeader
};
