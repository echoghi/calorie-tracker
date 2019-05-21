import styled from 'styled-components';
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
    max-width: 768px;
    margin: 0 auto;
    padding: 215px 0 30px;

    @media (max-width: 768px) {
        padding: 80px 0 90px 0;
    }
`;

const FormButton = styled(Button)`
    display: inline-block !important;
    margin: 0 20px !important;
    vertical-align: bottom !important;

    @media (max-width: 768px) {
        width: 100%;
        margin: 20px 0 !important;
    }
`;

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
    SettingsSection,
    DeleteAccountWrapper,
    AccountInfoWrapper,
    FormButton,
    GoalInputWrapper,
    CalorieInput,
    FatInput,
    ProteinInput,
    CarbInput,
    DisplayNameInput,
    GenderSelectWrapper,
    Container
};
