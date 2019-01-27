import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    NoteActions,
    NoNotes,
    NoteContainer,
    NoteBody,
    NoteTitle,
    NotesHeader,
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
import { errorNotification, successNotification, warningNotification } from '../actions';

const inputObj = class {
    constructor() {
        this.required = true;
        this.valid = false;
        this.dirty = false;
    }
};

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

function Notes({ day, dayRef, errorNotification, successNotification }) {
    const [state, setState] = React.useState({
        noteToEdit: 0,
        noteToRemove: 0,
        noteTitle: '',
        noteBody: '',
        activeNote: null,
        addNote: false,
        confirmationDialog: false,
        editNote: false,
        validation: {
            noteTitle: new inputObj(),
            noteBody: new inputObj()
        }
    });

    const {
        editNote,
        noteToEdit,
        confirmationDialog,
        addNote,
        noteToRemove,
        validation,
        activeNote
    } = state;

    const validateNote = name => validation[name].dirty && !validation[name].valid;
    let notes = [];

    function openEditModal(index) {
        const note = day.notes[index];
        const nextState = produce(state, draftState => {
            draftState.editNote = true;
            draftState.noteToEdit = index;
            draftState.noteBody = note.body;
            draftState.noteTitle = note.title;
        });

        setState(nextState);
    }

    function setActiveNote(note) {
        const nextState = produce(state, draftState => {
            draftState.activeNote = note;
        });

        setState(nextState);
    }

    function openConfirmationDialog(index) {
        const nextState = produce(state, draftState => {
            draftState.confirmationDialog = true;
            draftState.noteToRemove = index;
        });

        setState(nextState);
    }

    function openAddNoteDialog() {
        const nextState = produce(state, draftState => {
            draftState.addNote = true;
        });

        setState(nextState);
    }

    function closeConfirmationDialog() {
        const nextState = produce(state, draftState => {
            draftState.confirmationDialog = false;
        });

        setState(nextState);
    }

    const saveEditedNote = index => {
        const { noteBody, noteTitle } = state;

        if (noteBody && noteTitle) {
            const noteData = produce(day, data => {
                const note = data.notes[index];
                note.title = noteTitle;
                note.body = noteBody;
                note.time = moment().format('lll');
                note.edited = true;
            });

            dayRef.set(noteData, error => {
                if (error) {
                    errorNotification();
                } else {
                    successNotification('Note Saved');

                    const nextState = produce(state, draftState => {
                        draftState.noteBody = '';
                        draftState.noteTitle = '';
                        draftState.editNote = false;

                        // reset note validation
                        for (let attr in draftState.validation) {
                            if (draftState.validation[attr]) {
                                draftState.validation[attr] = new inputObj(true);
                            }
                        }
                    });

                    setState(nextState);
                }
            });
        }
    };

    const removeNote = index => {
        const noteData = produce(day, data => {
            data.notes = data.notes.filter(note => note !== data.notes[index]);
        });

        dayRef.set(noteData, error => {
            if (error) {
                errorNotification();
            } else {
                successNotification('Note Removed');

                const nextState = produce(state, draftState => {
                    draftState.confirmationDialog = false;
                });

                setState(nextState);
            }
        });
    };

    const onNoteChange = event => {
        const { name, value } = event.target;

        const nextState = produce(state, draftState => {
            // Mark input as dirty (interacted with)
            draftState.validation[name].dirty = true;
            draftState[name] = value;

            // If there is any value, mark it valid
            if (value !== '') {
                draftState.validation[name].valid = true;
            } else {
                draftState.validation[name].valid = false;
            }
        });

        setState(nextState);
    };

    function validateNotes() {
        const { validation } = state;

        // Check for incompleted fields
        for (let key in validation) {
            if (!validation[key]['valid']) {
                return false;
            }
        }

        return true;
    }

    const saveNewNote = () => {
        const { validation, noteTitle, noteBody } = state;

        if (validateNotes()) {
            const noteData = produce(day, payload => {
                if (!payload.notes) {
                    payload.notes = [];
                }

                payload.notes.push({
                    title: noteTitle,
                    body: noteBody,
                    time: moment().format('lll')
                });
            });

            dayRef.set(noteData, error => {
                if (error) {
                    errorNotification();
                } else {
                    successNotification('Note Added');

                    const nextState = produce(state, draftState => {
                        draftState.noteTitle = '';
                        draftState.noteBody = '';
                        draftState.addNote = false;

                        // reset note validation
                        for (let attr in draftState.validation) {
                            if (draftState.validation[attr]) {
                                draftState.validation[attr] = new inputObj();
                            }
                        }
                    });

                    setState(nextState);
                }
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr]) {
                    validation[attr].dirty = true;
                }
            }

            const nextState = produce(state, draftState => {
                draftState.validation = validation;
            });

            setState(nextState);
            errorNotification('Fields must not be empty.');
        }
    };

    function closeConfirmationDialog() {
        const nextState = produce(state, draftState => {
            draftState.confirmationDialog = false;
            draftState.noteTitle = '';
            draftState.noteBody = '';

            // reset note validation
            for (let attr in draftState.validation) {
                if (draftState.validation[attr]) {
                    draftState.validation[attr] = new inputObj();
                }
            }
        });

        setState(nextState);
    }

    for (let i in day.notes) {
        const note = day.notes[i];

        notes.push(
            <Note key={i} onClick={() => setActiveNote(note)}>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteBody>
                    <span>
                        {note.body.length > 30 ? `${note.body.substring(0, 30)}...` : note.body}
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

    if (!notes.length) {
        notes = (
            <NoNotes>
                <h4>No Notes Found</h4>
            </NoNotes>
        );
    }

    function closeEditDialog() {
        const nextState = produce(state, draftState => {
            draftState.editNote = false;
            draftState.noteTitle = '';
            draftState.noteBody = '';

            // reset note validation
            for (let attr in draftState.validation) {
                if (draftState.validation[attr]) {
                    draftState.validation[attr] = new inputObj(true);
                }
            }
        });

        setState(nextState);
    }

    function closeAddNoteDialog() {
        const nextState = produce(state, draftState => {
            draftState.addNote = false;
            draftState.noteTitle = '';
            draftState.noteBody = '';

            // reset note validation
            for (let attr in draftState.validation) {
                if (draftState.validation[attr]) {
                    draftState.validation[attr] = new inputObj(true);
                }
            }
        });

        setState(nextState);
    }

    function closeNoteDialog() {
        const nextState = produce(state, draftState => {
            draftState.activeNote = null;
        });

        setState(nextState);
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
                <Dialog fullWidth maxWidth={'sm'} open={editNote} onClose={closeEditDialog}>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogContent>
                        <div style={{ margin: '10px 0' }}>
                            <Input
                                name="noteTitle"
                                id="noteTitle"
                                label="Title"
                                fullWidth
                                defaultValue={day.notes ? day.notes[noteToEdit].title : ''}
                                onChange={onNoteChange}
                            />
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            <Input
                                name="noteBody"
                                id="noteBody"
                                label="Note"
                                multiline
                                fullWidth
                                rows="6"
                                defaultValue={day.notes ? day.notes[noteToEdit].body : ''}
                                onChange={onNoteChange}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => saveEditedNote(noteToEdit)}
                            color="primary"
                            variant="raised"
                        >
                            Save
                        </Button>
                        <Button onClick={closeEditDialog} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {addNote && (
                <Dialog fullWidth maxWidth={'sm'} open={addNote} onClose={closeAddNoteDialog}>
                    <DialogTitle>New Note</DialogTitle>
                    <DialogContent>
                        <div style={{ margin: '10px 0' }}>
                            <Input
                                name="noteTitle"
                                id="noteTitle"
                                label="Title"
                                required
                                fullWidth
                                onChange={onNoteChange}
                                error={validateNote('noteTitle')}
                            />
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            <Input
                                name="noteBody"
                                id="noteBody"
                                label="Note"
                                multiline
                                fullWidth
                                required
                                rows="6"
                                onChange={onNoteChange}
                                error={validateNote('noteBody')}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={saveNewNote} color="primary" variant="raised">
                            Save
                        </Button>
                        <Button onClick={closeAddNoteDialog} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
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

            <div className="nutrition__overview--calories">
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
            </div>
        </React.Fragment>
    );
}

export default connect(
    null,
    mapDispatchToProps
)(Notes);
