import React from 'react';
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
    NoteBox,
    Note
} from './styles';
import Input from '../Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import produce from 'immer';
import { Formik } from 'formik';
import { validateNote } from '../validation';
import { errorNotification, successNotification, warningNotification } from '../actions';
import { FormControl } from '@material-ui/core';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    errorMessage: message => dispatch(errorNotification(message)),
    successMessage: message => dispatch(successNotification(message)),
    warningMessage: message => dispatch(warningNotification(message))
});

function Notes({ day, index, userData, errorMessage, successMessage }) {
    const [activeNote, setActiveNote] = React.useState(null);
    const [noteToEdit, setNoteToEdit] = React.useState(0);
    const [noteToRemove, setNoteToRemove] = React.useState(0);
    const [addNote, setAddNote] = React.useState(false);
    const [editNote, setEditNote] = React.useState(false);
    const [confirmationDialog, setConfirmationDialog] = React.useState(false);

    let notes = [];

    function openEditModal(editIndex) {
        setNoteToEdit(editIndex);
        setEditNote(true);
    }

    function openConfirmationDialog(confirmIndex) {
        setConfirmationDialog(true);
        setNoteToRemove(confirmIndex);
    }

    function openAddNoteDialog() {
        setAddNote(true);
    }

    function closeConfirmationDialog() {
        setConfirmationDialog(false);
    }

    const removeNote = noteIndex => {
        const noteData = produce(day, data => {
            data.notes = data.notes.filter(note => note !== data.notes[noteIndex]);

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

    function closeConfirmationDialog() {
        setConfirmationDialog(false);
    }

    const maxNoteLength = window.innerWidth <= 768 ? 15 : 30;

    for (let i in day.notes) {
        if (day.notes[i]) {
            const note = day.notes[i];

            notes.push(
                <Note key={i} onClick={() => setActiveNote(note)}>
                    <NoteTitle>{note.title}</NoteTitle>
                    <NoteBody>
                        <span>
                            {note.body.length > maxNoteLength
                                ? `${note.body.substring(0, maxNoteLength)}...`
                                : note.body}
                        </span>
                        <span>{note.edited ? `${note.time} (edited)` : note.time}</span>
                    </NoteBody>
                    <NoteActions>
                        <IconButton
                            onClick={e => {
                                openEditModal(i);
                                e.stopPropagation();
                            }}
                        >
                            <i className="icon-edit" />
                        </IconButton>
                        <IconButton
                            onClick={e => {
                                openConfirmationDialog(i);
                                e.stopPropagation();
                            }}
                        >
                            <i className="icon-trash-2" />
                        </IconButton>
                    </NoteActions>
                </Note>
            );
        }
    }

    if (!notes.length) {
        notes = (
            <NoNotes>
                <h4>No Notes Found</h4>
            </NoNotes>
        );
    }

    function closeEditDialog() {
        setEditNote(false);
    }

    function closeAddNoteDialog() {
        setAddNote(false);
    }

    function closeNoteDialog() {
        setActiveNote(null);
    }

    return (
        <React.Fragment>
            {confirmationDialog && (
                <Dialog maxWidth={'md'} open={confirmationDialog} onClose={closeConfirmationDialog}>
                    <DialogTitle>{`Remove "${
                        day.notes && day.notes[noteToRemove] ? day.notes[noteToRemove].title : ''
                    }"`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove this note?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => removeNote(noteToRemove)}
                            color="primary"
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button onClick={closeConfirmationDialog} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {editNote && (
                <Formik
                    initialValues={{
                        title: day.notes ? day.notes[noteToEdit].title : '',
                        body: day.notes ? day.notes[noteToEdit].body : ''
                    }}
                    validate={validateNote}
                    onSubmit={(values, actions) => {
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
                    }}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Dialog fullWidth maxWidth={'sm'} open={editNote} onClose={closeEditDialog}>
                            <DialogTitle>Edit Note</DialogTitle>

                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <FormControl margin="normal" fullWidth>
                                        <Input
                                            name="title"
                                            label="Title"
                                            error={errors.title && touched.title}
                                            value={values.title}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl margin="normal" fullWidth>
                                        <Input
                                            name="body"
                                            label="Note"
                                            multiline
                                            rows="6"
                                            error={errors.body && touched.body}
                                            value={values.body}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleSubmit} color="primary" variant="raised">
                                    Save
                                </Button>
                                <Button onClick={closeEditDialog} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Formik>
            )}

            {addNote && (
                <Formik
                    initialValues={{
                        title: day.notes ? day.notes[noteToEdit].title : '',
                        body: day.notes ? day.notes[noteToEdit].body : ''
                    }}
                    validate={validateNote}
                    onSubmit={(values, actions) => {
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
                                body: body,
                                time: moment().format('lll'),
                                title: title
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
                    }}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Dialog
                            fullWidth
                            maxWidth={'sm'}
                            open={addNote}
                            onClose={closeAddNoteDialog}
                        >
                            <DialogTitle>New Note</DialogTitle>
                            <DialogContent>
                                <FormControl margin="normal" fullWidth>
                                    <Input
                                        name="title"
                                        label="Title"
                                        required
                                        onChange={handleChange}
                                        error={errors.title && touched.title}
                                        value={values.title}
                                    />
                                </FormControl>
                                <FormControl margin="normal" fullWidth>
                                    <Input
                                        name="body"
                                        label="Note"
                                        multiline
                                        required
                                        rows="6"
                                        onChange={handleChange}
                                        error={errors.body && touched.body}
                                        value={values.body}
                                    />
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleSubmit} color="primary" variant="raised">
                                    Save
                                </Button>
                                <Button onClick={closeAddNoteDialog} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Formik>
            )}

            {activeNote && (
                <Dialog fullWidth maxWidth={'sm'} open={!!activeNote} onClose={closeNoteDialog}>
                    <DialogTitle>{`${activeNote.title} - ${activeNote.time}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{activeNote.body}</DialogContentText>
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
                    <Button
                        variant="fab"
                        color="primary"
                        aria-label="add note"
                        onClick={openAddNoteDialog}
                        style={{ fontSize: 20 }}
                    >
                        <i className="icon-plus" />
                    </Button>
                </NotesHeader>

                <NoteContainer>{notes}</NoteContainer>
            </NoteBox>
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);
