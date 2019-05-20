import React, { useState } from 'react';
import { connect } from 'react-redux';
import Firebase from '../firebase';
import moment from 'moment';
import {
    NoteActions,
    NoNotes,
    NoteContainer,
    NoteBody,
    NoteTitle,
    NotesHeader,
    EmptyContainer,
    NoteBox,
    Note
} from './styles';
import Input from '../Input';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import produce from 'immer';
import { Formik, FormikActions } from 'formik';
import { validateNote, NoteValues } from '../validation';
import { errorNotification, successNotification } from '../actions';
import { FormControl, Fab } from '@material-ui/core';
import { RootState, Day, Note as NoteProps } from '../types';
import firebase from 'firebase';
import EmptyNoteIcon from '../Icons/EmptyNoteIcon';
import NoteMenu from './NoteMenu';

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message),
    successMessage: (message?: string) => successNotification(message)
};

interface Notes {
    day: Day;
    index: number;
    userData: firebase.UserInfo;
    errorMessage: (message?: string) => void;
    successMessage: (message?: string) => void;
}

function Notes({ day, index, userData, errorMessage, successMessage }: Notes) {
    const [activeNote, setActiveNote] = useState(null);
    const [noteToEdit, setNoteToEdit] = useState(0);
    const [noteToRemove, setNoteToRemove] = useState(0);
    const [addNote, setAddNote] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState(false);

    function openEditModal(editIndex: number) {
        setNoteToEdit(editIndex);
        setEditNote(true);
    }

    function openConfirmationDialog(confirmIndex: number) {
        setConfirmationDialog(true);
        setNoteToRemove(confirmIndex);
    }

    function openAddNoteDialog() {
        setAddNote(true);
    }

    function closeConfirmationDialog() {
        setConfirmationDialog(false);
    }

    const removeNote = (noteIndex: number) => {
        const noteData = produce(day, data => {
            data.notes = data.notes.filter((note: NoteProps) => note !== data.notes[noteIndex]);

            // convert moment object back to original format
            data.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year')
            };
        });

        const dayRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${index}`);

        dayRef.set(noteData, error => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Note Removed');

                setConfirmationDialog(false);
            }
        });
    };

    function closeEditDialog() {
        setEditNote(false);
    }

    function closeAddNoteDialog() {
        setAddNote(false);
    }

    function closeNoteDialog() {
        setActiveNote(null);
    }

    const removeHandler = () => removeNote(noteToRemove);

    const submitHandler = (values: NoteValues, actions: FormikActions<NoteValues>) => {
        const { title, body } = values;

        const noteData = produce(day, payload => {
            // convert moment object back to original format
            payload.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year')
            };

            if (!payload.notes) {
                payload.notes = [];
            }

            payload.notes.push({
                body,
                time: moment().format('lll'),
                title
            });
        });

        const dayRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${index}`);

        dayRef.set(noteData, error => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Note Added');

                setAddNote(false);
            }
        });

        actions.setSubmitting(false);
        actions.resetForm();
    };

    const editNoteHandler = (values: NoteValues, actions: FormikActions<NoteValues>) => {
        const { title, body } = values;

        if (title && body) {
            const noteData = produce(day, data => {
                // convert moment object back to original format
                data.day = {
                    date: day.day.date(),
                    month: day.day.get('month'),
                    year: day.day.get('year')
                };

                const note = data.notes[noteToEdit];
                note.title = title;
                note.body = body;
                note.time = moment().format('lll');
                note.edited = true;
            });

            const dayRef = Firebase.db
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${index}`);

            dayRef.set(noteData, error => {
                if (error) {
                    errorMessage();
                } else {
                    successMessage('Note Saved');

                    setEditNote(false);
                }
            });
        }

        actions.setSubmitting(false);
        actions.resetForm();
    };

    return (
        <React.Fragment>
            {confirmationDialog && (
                <Dialog maxWidth={'md'} open={confirmationDialog} onClose={closeConfirmationDialog}>
                    <DialogTitle>{`Remove "${
                        day.notes && day.notes[noteToRemove] ? day.notes[noteToRemove].title : ''
                    }"`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="subtitle1">
                                Are you sure you want to remove this note?
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={removeHandler} color="primary" variant="contained">
                            Delete
                        </Button>
                        <Button onClick={closeConfirmationDialog} color="primary" autoFocus={true}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {editNote && (
                <Formik
                    initialValues={{
                        body: day.notes ? day.notes[noteToEdit].body : '',
                        title: day.notes ? day.notes[noteToEdit].title : ''
                    }}
                    validate={validateNote}
                    onSubmit={editNoteHandler}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Dialog
                            fullWidth={true}
                            maxWidth={'sm'}
                            open={editNote}
                            onClose={closeEditDialog}
                        >
                            <DialogTitle>Edit Note</DialogTitle>

                            <form onSubmit={handleSubmit} noValidate={true}>
                                <DialogContent>
                                    <FormControl margin="normal" fullWidth={true}>
                                        <Input
                                            name="title"
                                            label="Title"
                                            error={errors.title && touched.title}
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl margin="normal" fullWidth={true}>
                                        <Input
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
                                        <Button type="submit" color="primary" variant="contained">
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
            )}

            {addNote && (
                <Formik
                    initialValues={{
                        body: '',
                        title: ''
                    }}
                    validate={validateNote}
                    onSubmit={submitHandler}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Dialog
                            fullWidth={true}
                            maxWidth={'sm'}
                            open={addNote}
                            onClose={closeAddNoteDialog}
                        >
                            <DialogTitle>New Note</DialogTitle>
                            <form onSubmit={handleSubmit} noValidate={true}>
                                <DialogContent>
                                    <FormControl margin="normal" fullWidth={true}>
                                        <Input
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
            )}

            {activeNote && (
                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={!!activeNote}
                    onClose={closeNoteDialog}
                >
                    <DialogTitle>
                        {`${activeNote.title}`}
                        <DialogContentText>{activeNote.time}</DialogContentText>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="subtitle1">{activeNote.body}</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeNoteDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <NoteBox>
                <NotesHeader>
                    Notes{' '}
                    <Fab
                        color="primary"
                        aria-label="add note"
                        onClick={openAddNoteDialog}
                        style={{ fontSize: 20 }}
                    >
                        <i className="icon-plus" />
                    </Fab>
                </NotesHeader>

                <NoteContainer>
                    {day.notes &&
                        day.notes.map((note: NoteProps, i: number) => {
                            const clickHandler = () => setActiveNote(note);
                            const editHandler = (
                                event: React.MouseEvent<HTMLElement, MouseEvent>
                            ) => {
                                event.stopPropagation();
                                openEditModal(i);
                            };
                            const confirmHandler = (
                                event: React.MouseEvent<HTMLElement, MouseEvent>
                            ): void => {
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
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);
