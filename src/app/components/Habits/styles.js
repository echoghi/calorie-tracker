import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import config from '@config';
import Input from '../Inputs/Input';

const Container = styled.div`
    background: rgb(250, 250, 250);
    height: 100vh;
    max-width: 1400px;
    margin: 0 auto;

    @media (max-width: 768px) {
        display: block;
        padding-bottom: 300px;
    }
`;

const Box = styled.div`
    width: 600px;
    height: 395px;
    overflow-y: auto;
    position: relative;
    margin: 0 auto;
    border: 1px solid #e6eaee;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    background: #ffffff;
    text-align: center;

    @media (max-width: 768px) {
        display: block;
        width: auto;
        margin: 1rem auto;

        &:first-child {
            height: 325px;
            margin-top: 6rem;
        }

        &:nth-child(2) {
            height: 415px;
        }
    }
`;

const Header = styled.h1`
    color: ${config.palette.primary};
    text-align: left;
    margin-top: 190px;

    @media (max-width: 768px) {
        margin: 100px 1rem 0;
    }
`;

const SubHead = styled.h2`
    color: ${config.palette.text.primary};
    text-align: left;
    font-size: 16px;
    margin: 1em 0;

    @media (max-width: 768px) {
        margin: 15px;
    }
`;

const Form = styled.form`
    padding: 15px 0;
    position: relative;

    #habit-error {
        position: absolute;
        bottom: -10px;
        left: 2px;
    }

    @media (max-width: 768px) {
        width: auto;
        padding: 15px;

        #habit-error {
            position: absolute;
            top: 8px;
            right: 15px;
            left: auto;
            bottom: auto;
        }
    }
`;

const HabitTitle = styled.div`
    width: 30%;
    text-align: left;

    @media (max-width: 768px) {
        width: 25%;
    }
`;

const HabitBody = styled.div`
    width: 40%;
    text-align: left;

    span {
        display: block;
    }
    span:nth-child(2) {
        color: rgb(38, 155, 218);
    }
`;

const TableContainer = styled.div`
    @media (max-width: 768px) {
        margin: 0 15px;
    }
`;

const FormButton = withStyles({
    root: {
        boxShadow: 'none',
        display: 'inline-block',
        fontSize: 16,
        height: 40,
        margin: '0 10px',
        verticalAlign: 'bottom',
        ['@media (max-width: 768px)']: {
            margin: '20px 0',
            width: '100%'
        }
    }
})(Button);

const HabitInput = styled(Input)`
    width: 300px;
    display: inline-block;
    margin-bottom: 0;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export {
    Container,
    Header,
    Box,
    SubHead,
    Form,
    HabitBody,
    HabitTitle,
    TableContainer,
    FormButton,
    HabitInput
};
