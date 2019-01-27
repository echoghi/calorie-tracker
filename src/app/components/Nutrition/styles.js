import styled from 'styled-components';

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const MealsHeader = styled.div`
    padding: 10px 20px;
    font-size: 25px;
    display: flex;
    height: 77px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6eaee;
`;

const MealForm = styled.form`
    margin: 10px 0;
`;

const NotesHeader = styled.div`
    padding: 10px 20px;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6eaee;
`;

const Note = styled.div`
    padding: 15px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e6eaee;
    cursor: pointer;

    &:first-child {
        border-top: 0;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.03);
    }
`;

const NoteContainer = styled.div`
    overflow: auto;
    height: 348px;
`;

const NoNotes = styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    h4 {
        padding: 0;
        margin: 0 auto;
        text-align: center;
    }
`;

const NoteTitle = styled.div`
    width: 40.3%;
    text-align: left;
`;

const NoteBody = styled.div`
    width: 39.3%;
    text-align: left;

    span {
        display: block;
    }
    span:nth-child(2) {
        color: rgb(38, 155, 218);
    }
`;

const NoteActions = styled.div`
    width: 20.3%;
    text-align: right;
`;

export {
    NoteActions,
    NoNotes,
    NoteContainer,
    NoteBody,
    NoteTitle,
    NotesHeader,
    MealForm,
    MealsHeader,
    HeaderWrapper,
    Note
};
