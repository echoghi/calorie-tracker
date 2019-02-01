import styled from 'styled-components';

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
    padding: 215px 125px 30px 125px;

    @media (max-width: 768px) {
        padding: 80px 0 90px 0;
    }
`;

export {
    SettingsWrapper,
    SettingsHeader,
    SettingsSubHeader,
    SettingsSection,
    DeleteAccountWrapper,
    Container
};
