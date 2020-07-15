import React, { memo, Fragment, useReducer } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import produce from 'immer';
import { Formik } from 'formik';
import { FormControl, Fab } from '@material-ui/core';

import {
    NoteActions,
    NoNotes,
    NoteContainer,
    NoteBody,
    NoteTitle,
    NotesHeader,
    EmptyContainer,
    NoteBox,
    Note,
    iconStyle,
} from './styles';
import Input from '../Inputs/Input';
import Firebase from '../firebase';
import EmptyNoteIcon from '../Icons/EmptyNoteIcon';
import NoteMenu from './NoteMenu';
import { validateNote, NoteValues } from '../validation';
import { errorNotification, successNotification } from '../actions';

const mapStateToProps = (state) => ({
    userData: state.adminState.userData,
});

const mapDispatchToProps = {
    errorMessage: (message) => errorNotification(message),
    successMessage: (message) => successNotification(message),
};

const noteState = {
    activeNote: null,
    addNote: false,
    confirmationDialog: false,
    editNote: false,
    noteToEdit: 0,
    noteToRemove: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_ACTIVE_NOTE':
            return { ...state, activeNote: action.data };

        case 'SET_NOTE_REMOVE':
            return { ...state, noteToRemove: action.data };

        case 'CLEAR_ACTIVE_NOTE':
            return { ...state, activeNote: null };

        case 'TOGGLE_EDIT':
            return { ...state, editNote: !state.editNote };

        case 'TOGGLE_ADD':
            return { ...state, addNote: !state.addNote };

        case 'TOGGLE_CONFIRM':
            return { ...state, confirmationDialog: !state.confirmationDialog };

        case 'OPEN_CONFIRM_DIALOG':
            return { ...state, confirmationDialog: true, noteToRemove: action.data };

        case 'OPEN_EDIT_DIALOG':
            return { ...state, editNote: true, noteToEdit: action.data };

        default:
            return state;
    }
}

function Notes({ day, index, userData, errorMessage, successMessage }) {
    const [state, dispatch] = useReducer(reducer, noteState);

    function openEditModal(editIndex) {
        dispatch({ type: 'OPEN_EDIT_DIALOG', data: editIndex });
    }

    function openConfirmationDialog(confirmIndex) {
        dispatch({ type: 'OPEN_CONFIRM_DIALOG', data: confirmIndex });
    }

    function openAddNoteDialog() {
        dispatch({ type: 'TOGGLE_ADD' });
    }

    function closeConfirmationDialog() {
        dispatch({ type: 'TOGGLE_CONFIRM' });
    }

    const removeNote = (noteIndex) => {
        const noteData = produce(day, (data) => {
            data.notes = data.notes.filter((note) => note !== data.notes[noteIndex]);

            // convert moment object back to original format
            data.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year'),
            };
        });

        const dayRef = Firebase.db.ref('users').child(userData.uid).child(`calendar/${index}`);

        dayRef.set(noteData, (error) => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Note Removed');

                dispatch({ type: 'TOGGLE_CONFIRM' });
            }
        });
    };

    function closeEditDialog() {
        dispatch({ type: 'TOGGLE_EDIT' });
    }

    function closeAddNoteDialog() {
        dispatch({ type: 'TOGGLE_ADD' });
    }

    function closeNoteDialog() {
        dispatch({ type: 'CLEAR_ACTIVE_NOTE' });
    }

    const removeHandler = () => removeNote(state.noteToRemove);

    const submitHandler = (values, actions) => {
        const { title, body } = values;

        const noteData = produce(day, (payload) => {
            // convert moment object back to original format
            payload.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year'),
            };

            if (!payload.notes) {
                payload.notes = [];
            }

            payload.notes.push({
                body,
                time: moment().format('lll'),
                title,
            });
        });

        const dayRef = Firebase.db.ref('users').child(userData.uid).child(`calendar/${index}`);

        dayRef.set(noteData, (error) => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Note Added');

                dispatch({ type: 'TOGGLE_ADD' });
            }
        });

        actions.setSubmitting(false);
        actions.resetForm();
    };

    const editNoteHandler = (values, actions) => {
        const { title, body } = values;

        if (title && body) {
            const noteData = produce(day, (data) => {
                // convert moment object back to original format
                data.day = {
                    date: day.day.date(),
                    month: day.day.get('month'),
                    year: day.day.get('year'),
                };

                const note = data.notes[state.noteToEdit];
                note.title = title;
                note.body = body;
                note.time = moment().format('lll');
                note.edited = true;
            });

            const dayRef = Firebase.db.ref('users').child(userData.uid).child(`calendar/${index}`);

            dayRef.set(noteData, (error) => {
                if (error) {
                    errorMessage();
                } else {
                    successMessage('Note Saved');

                    dispatch({ type: 'TOGGLE_EDIT' });
                }
            });
        }

        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <Fragment>
            {[
                // Delete confirmation dialog
                state.confirmationDialog && (
                    <Dialog
                        key={0}
                        maxWidth={'md'}
                        open={state.confirmationDialog}
                        onClose={closeConfirmationDialog}
                    >
                        <DialogTitle>{`Remove "${
                            day.notes && day.notes[state.noteToRemove]
                                ? day.notes[state.noteToRemove].title
                                : ''
                        }"`}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1">
                                Are you sure you want to remove this note?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={removeHandler} color="primary" variant="contained">
                                Delete
                            </Button>
                            <Button
                                onClick={closeConfirmationDialog}
                                color="primary"
                                autoFocus={true}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                ),

                // Edit note dialog
                state.editNote && (
                    <Formik
                        key={1}
                        initialValues={{
                            body: day.notes ? day.notes[state.noteToEdit].body : '',
                            title: day.notes ? day.notes[state.noteToEdit].title : '',
                        }}
                        validate={validateNote}
                        onSubmit={editNoteHandler}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit }) => (
                            <Dialog
                                fullWidth={true}
                                maxWidth={'sm'}
                                open={state.editNote}
                                onClose={closeEditDialog}
                            >
                                <DialogTitle>Edit Note</DialogTitle>

                                <form onSubmit={handleSubmit} noValidate={true}>
                                    <DialogContent>
                                        <FormControl margin="normal" fullWidth={true}>
                                            <Input
                                                id="title"
                                                name="title"
                                                label="Title"
                                                error={errors.title && touched.title}
                                                value={values.title}
                                                onChange={handleChange}
                                            />
                                        </FormControl>
                                        <FormControl margin="normal" fullWidth={true}>
                                            <Input
                                                id="body"
                                                name="body"
                                                label="Note"
                                                multiline={true}
                                                rows={6}
                                                error={errors.body && touched.body}
                                                value={values.body}
                                                onChange={handleChange}
                                            />
                                        </FormControl>

                                        <DialogActions>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                variant="contained"
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={closeEditDialog} color="primary">
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        )}
                    </Formik>
                ),

                // Add note dialog
                state.addNote && (
                    <Formik
                        key={2}
                        initialValues={{
                            body: '',
                            title: '',
                        }}
                        validate={validateNote}
                        onSubmit={submitHandler}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit }) => (
                            <Dialog
                                fullWidth={true}
                                maxWidth={'sm'}
                                open={state.addNote}
                                onClose={closeAddNoteDialog}
                            >
                                <DialogTitle>New Note</DialogTitle>
                                <form onSubmit={handleSubmit} noValidate={true}>
                                    <DialogContent>
                                        <FormControl margin="normal" fullWidth={true}>
                                            <Input
                                                id="title"
                                                name="title"
                                                label="Title"
                                                required={true}
                                                onChange={handleChange}
                                                error={errors.title && touched.title}
                                                value={values.title}
                                            />
                                        </FormControl>
                                        <FormControl margin="normal" fullWidth={true}>
                                            <Input
                                                id="body"
                                                name="body"
                                                label="Note"
                                                multiline={true}
                                                required={true}
                                                rows={6}
                                                onChange={handleChange}
                                                error={errors.body && touched.body}
                                                value={values.body}
                                            />
                                        </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button type="submit" color="primary" variant="contained">
                                            Save
                                        </Button>
                                        <Button onClick={closeAddNoteDialog} color="primary">
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
                        )}
                    </Formik>
                ),

                // View note dialog
                state.activeNote && (
                    <Dialog
                        key={3}
                        fullWidth={true}
                        maxWidth="sm"
                        open={!!state.activeNote}
                        onClose={closeNoteDialog}
                    >
                        <DialogTitle>
                            {`${state.activeNote.title}`}
                            <DialogContentText>{state.activeNote.time}</DialogContentText>
                        </DialogTitle>

                        <DialogContent>
                            <Typography variant="subtitle1">{state.activeNote.body}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeNoteDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                ),
            ].filter(Boolean)}

            <NoteBox>
                <NotesHeader>
                    Notes
                    <Fab
                        color="primary"
                        aria-label="add note"
                        onClick={openAddNoteDialog}
                        style={iconStyle}
                    >
                        <i className="icon-plus" />
                    </Fab>
                </NotesHeader>

                <NoteContainer>
                    {day.notes &&
                        day.notes.map((note, i) => {
                            const clickHandler = () =>
                                dispatch({ data: note, type: 'SET_ACTIVE_NOTE' });
                            const editHandler = (event) => {
                                event.stopPropagation();
                                openEditModal(i);
                            };
                            const confirmHandler = (event) => {
                                event.stopPropagation();
                                openConfirmationDialog(i);
                            };

                            return (
                                <Note key={i} onClick={clickHandler}>
                                    <NoteTitle>
                                        <Typography variant="body1" noWrap={true}>
                                            {note.title}
                                        </Typography>
                                    </NoteTitle>
                                    <NoteBody>
                                        <Typography variant="subtitle1" noWrap={true}>
                                            {note.body}
                                        </Typography>

                                        <Typography
                                            variant="subtitle2"
                                            noWrap={true}
                                            color="textSecondary"
                                        >
                                            {note.edited ? `${note.time} (edited)` : note.time}
                                        </Typography>
                                    </NoteBody>
                                    <NoteActions>
                                        <NoteMenu remove={confirmHandler} edit={editHandler} />
                                    </NoteActions>
                                </Note>
                            );
                        })}

                    {!day.notes && (
                        <NoNotes>
                            <EmptyContainer>
                                <EmptyNoteIcon />
                                <h4>No Notes Found</h4>
                            </EmptyContainer>
                        </NoNotes>
                    )}
                </NoteContainer>
            </NoteBox>
        </Fragment>
    );
}

export default memo(connect(mapStateToProps, mapDispatchToProps)(Notes));
