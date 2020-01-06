import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Input from '../Inputs/Input';

const SettingsWrapper = styled.div`
    padding: 20px;
    background: #fff;
    border: 1px solid #dbdbdb;

    @media (max-width: 768px) {
        border: none;
    }
`;

const SettingsHeader = styled.h1`
    font-size: 20px;
    margin: 10px 0;
`;

const SettingsSubHeader = styled.h2`
    font-size: 16px;
    margin: 10px 0 20px 0;
    font-weight: normal;
`;

const SettingsSection = styled.div`
    padding: 15px 0;
    border-bottom: 1px solid #dbdbdb;
`;

const DeleteAccountWrapper = styled.div`
    padding: 15px 0;
`;

const Container = styled.div`
    max-width: 1024px;
    margin: 0 auto;
    padding: 200px 0 30px;

    @media (max-width: 1024px) {
        max-width: 768px;
    }

    @media (max-width: 768px) {
        padding: 80px 0 90px 0;
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

const DeleteButton = withStyles({
    root: {
        background: '#cb2431',
        boxShadow: 'none',
        color: '#FFFFFF',
        fontSize: 18,
        height: 48,

        padding: '0 15px',

        '&:hover': {
            background: 'rgb(173, 27, 38)'
        }
    }
})(Button);

const DisplayNameInput = styled(Input)`
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const InfoInput = styled(Input)`
    padding: 0 5px !important;
    width: 90px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const DobInput = styled(InfoInput)`
    width: 130px;
`;

export const IconLock = styled.div`
    cursor: pointer;
    color: ${props => props.color};
`;

const CalorieInput = styled(Input)`
    width: 120px;
    margin: 0 5px !important;
    padding: 0 !important;

    @media (max-width: 768px) {
        width: 100%;
        margin: 0 10px 0 0;
    }
`;

const FatInput = styled(Input)`
    width: 120px;
    margin: 0 5px !important;
    padding: 0 !important;

    @media (max-width: 768px) {
        width: 100%;
        margin: 0 10px 0 0;
    }
`;

const CarbInput = styled(Input)`
    width: 120px;
    margin: 0 5px !important;
    padding: 0 !important;

    @media (max-width: 768px) {
        width: 100%;
        margin: 0 0 0 10px;
    }
`;

const ProteinInput = styled(Input)`
    width: 120px;
    margin: 0 5px !important;
    padding: 0 !important;

    @media (max-width: 768px) {
        width: 100%;
        margin: 0 0 0 10px;
    }
`;

const GenderSelectWrapper = styled.div`
    margin-top: 8px;
    display: inline-block;
    padding: 0 5px;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
        padding: 0;
    }
`;

const GoalInputWrapper = styled.div`
    display: inline-block;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
`;

const AccountInfoWrapper = styled.div`
    display: inline-block;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
    }
`;

export {
    SettingsWrapper,
    SettingsHeader,
    SettingsSubHeader,
    InfoInput,
    DobInput,
    SettingsSection,
    DeleteAccountWrapper,
    AccountInfoWrapper,
    FormButton,
    DeleteButton,
    GoalInputWrapper,
    CalorieInput,
    FatInput,
    ProteinInput,
    CarbInput,
    DisplayNameInput,
    GenderSelectWrapper,
    Container
};
