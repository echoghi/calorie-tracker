import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withFirebase from './HOC/withFirebase';
import moment from 'moment';
import queryString from 'query-string';
import isEmpty from 'lodash.isempty';
// Components
import Input from './Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import ReactTable from 'react-table';
import { tableStyle, getSortedComponentClass } from './TableUtils';
import ProgressBar from './ProgressBar';
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

const snackbarOrigin = {
    vertical: 'bottom',
    horizontal: 'left'
};

// Reusable validation constuctor for each input
const inputObj = class {
    constructor(required) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    data: state.adminState.data
});

class Nutrition extends React.Component {
    constructor(props) {
        super(props);

        let requestedDate = null;

        if (this.props.location.search) {
            const parsed = queryString.parse(location.search);
            requestedDate = moment(parseInt(parsed.d));
        }

        this.state = {
            requestedDate,
            day: {},
            formattedDay: {},
            snackbar: false,
            todayButton: false,
            messageInfo: {},
            validation: {
                name: new inputObj(true),
                servings: new inputObj(true),
                calories: new inputObj(true),
                protein: new inputObj(true),
                carbs: new inputObj(true),
                fat: new inputObj(true),
                note: {
                    noteTitle: new inputObj(true),
                    noteBody: new inputObj(true)
                }
            },
            sorted: []
        };

        this.queue = [];

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        const { userData } = this.props;

        if (!isEmpty(userData)) {
            this.mapDayToState(userData);
        }
    }

    componentDidUpdate(prevProps) {
        const { userData } = this.props;

        if (userData !== prevProps.userData && !isEmpty(userData)) {
            this.mapDayToState(userData);
        }
    }

    mapDayToState = userData => {
        const { today, requestedDate } = this.state;
        const { loadDay, history } = this.props;

        if (today) {
            history.push({ pathname: '/nutrition', search: '' });
        }

        const { day, todayButton, formattedDay, dayRef, dayIndex } = loadDay(
            userData,
            requestedDate
        );

        this.setState({
            todayButton,
            day,
            formattedDay,
            dayRef,
            dayIndex
        });
    };

    renderMealsTable() {
        const { day, sorted } = this.state;

        return (
            <ReactTable
                style={tableStyle.table}
                ref={instance => (this.tableInstance = instance)}
                data={!isEmpty(day) ? day.nutrition.meals : []}
                noDataText="No Meals Found"
                columns={[
                    {
                        headerText: 'Meal',
                        accessor: 'name',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Calories',
                        accessor: 'calories',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Protein',
                        accessor: 'protein',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Carbs',
                        accessor: 'carbs',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Fat',
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Servings',
                        accessor: 'servings',
                        Cell: row => row.original.servings || '---',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => this.renderActions(row.index),
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        Header: 'Modify',
                        style: tableStyle.cellCentered
                    }
                ]}
                getTheadProps={() => {
                    return {
                        style: tableStyle.header
                    };
                }}
                getTheadThProps={() => {
                    return {
                        style: tableStyle.th
                    };
                }}
                getTrGroupProps={() => {
                    return {
                        style: tableStyle.tbodyTr
                    };
                }}
                onSortedChange={sorted =>
                    this.setState({
                        sorted
                    })
                }
                defaultPageSize={10}
                className="-striped -highlight"
            />
        );
    }

    renderActions(index) {
        return (
            <IconButton
                onClick={() => this.setState({ confirmationDialog: true, deleteMeal: index })}
            >
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    deleteMeal = index => {
        const { dayRef, day, snackbar } = this.state;
        const meal = day.nutrition.meals[index];

        for (let name in day.nutrition) {
            if (name !== 'meals') {
                day.nutrition[name] -= meal[name] * meal.servings;
            }
        }

        day.nutrition.meals = day.nutrition.meals.filter(
            meal => meal !== day.nutrition.meals[index]
        );

        this.setState({ confirmationDialog: false, deleteMeal: null });

        dayRef.set(day, error => {
            if (error) {
                console.log('Delete Meal Error', error);
            } else {
                this.queue.push({
                    message: 'Meal Removed',
                    key: new Date().getTime()
                });

                if (snackbar) {
                    // immediately begin dismissing current message
                    // to start showing new one
                    this.setState({ snackbar: false });
                } else {
                    this.processQueue();
                }
            }
        });
    };

    deleteNote = index => {
        const { dayRef, day, snackbar } = this.state;

        day.notes = day.notes.filter(note => note !== day.notes[index]);

        this.setState({ noteConfirmationDialog: false });

        dayRef.set(day, error => {
            if (error) {
                console.log('Remove Note Error', error);
            } else {
                this.queue.push({
                    message: 'Note Removed',
                    key: new Date().getTime()
                });

                if (snackbar) {
                    // immediately begin dismissing current message
                    // to start showing new one
                    this.setState({ snackbar: false });
                } else {
                    this.processQueue();
                }
            }
        });
    };

    editNote = index => {
        const { dayRef, noteBody, noteTitle, snackbar, day } = this.state;

        if (this.validateEditedNotes()) {
            let note = day.notes[index];

            note.title = noteTitle;
            note.body = noteBody;
            note.time = moment().format('lll');
            note.edited = true;

            dayRef.set(day, error => {
                if (error) {
                    console.log('Edit Note Error', error);
                } else {
                    this.queue.push({
                        message: 'Note Saved',
                        key: new Date().getTime()
                    });

                    if (snackbar) {
                        // immediately begin dismissing current message
                        // to start showing new one
                        this.setState({ snackbar: false });
                    } else {
                        this.processQueue();
                    }

                    this.setState({ editNote: false, noteBody: '', noteTitle: '' });
                    this.resetNoteValidation();
                }
            });
        }
    };

    /**
     * Validate Inputs
     *
     * @return valid - validation status
     */
    validateInputs() {
        let { validation } = this.state;
        let valid = true;
        // Check for incompleted fields
        for (let key in validation) {
            if (key !== 'note' && !validation[key]['valid']) {
                return false;
            }
        }

        return valid;
    }

    resetNoteValidation() {
        let { validation } = this.state;

        // Reset Validation
        for (let attr in validation.note) {
            if (validation['note'][attr]) {
                validation['note'][attr] = new inputObj(true);
            }
        }

        this.setState({ validation });
    }

    resetMealValidation() {
        let { validation } = this.state;

        // Reset Validation
        for (let attr in validation) {
            if (validation[attr] && attr !== 'note') {
                validation[attr] = new inputObj(true);
            }
        }

        this.setState({ validation });
    }

    validateNotes() {
        let { validation } = this.state;
        let valid = true;
        // Check for incompleted fields
        for (let key in validation['note']) {
            if (!validation['note'][key]['valid']) {
                return false;
            }
        }

        return valid;
    }

    validateEditedNotes() {
        let { noteBody, noteTitle } = this.state;

        if (noteBody && noteTitle) {
            return true;
        } else {
            return false;
        }
    }

    onChange = name => event => {
        let obj = Object.assign({}, this.state);
        // Mark input as dirty (interacted with)
        obj.validation[name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation[name].valid = true;
        } else {
            obj.validation[name].valid = false;
        }

        this.setState(obj);
    };

    onNoteChange = name => event => {
        let obj = Object.assign({}, this.state);
        // Mark input as dirty (interacted with)
        obj.validation['note'][name].dirty = true;
        obj[name] = event.target.value;

        // If there is any value, mark it valid
        if (event.target.value !== '') {
            obj.validation['note'][name].valid = true;
        } else {
            obj.validation['note'][name].valid = false;
        }

        this.setState(obj);
    };

    onSubmit = () => {
        let {
            dayRef,
            day,
            name,
            servings,
            calories,
            fat,
            carbs,
            protein,
            validation,
            snackbar
        } = this.state;

        if (this.validateInputs()) {
            day.nutrition.calories += parseInt(calories) * servings;
            day.nutrition.fat += parseInt(fat) * servings;
            day.nutrition.protein += parseInt(protein) * servings;
            day.nutrition.carbs += parseInt(carbs) * servings;

            document.getElementById('name').value = '';
            document.getElementById('servings').value = '';
            document.getElementById('calories').value = '';
            document.getElementById('carbs').value = '';
            document.getElementById('fat').value = '';
            document.getElementById('protein').value = '';

            if (!day.nutrition.meals) {
                day.nutrition.meals = [];
            }

            day.nutrition.meals.push({
                name,
                servings: parseInt(servings),
                calories: parseFloat(calories),
                fat: parseFloat(fat),
                protein: parseFloat(protein),
                carbs: parseFloat(carbs)
            });

            dayRef.set(day, error => {
                if (error) {
                    console.log('Add Meal Error', error);
                } else {
                    this.queue.push({
                        message: 'Meal Added',
                        key: new Date().getTime()
                    });

                    if (snackbar) {
                        // immediately begin dismissing current message
                        // to start showing new one
                        this.setState({ snackbar: false });
                    } else {
                        this.processQueue();
                    }

                    this.setState({
                        calories: '',
                        fat: '',
                        carbs: '',
                        protein: '',
                        name: '',
                        servings: ''
                    });
                    this.resetMealValidation();
                }
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation) {
                if (validation[attr] && attr !== 'note') {
                    validation[attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    addNote = () => {
        let { dayRef, noteBody, noteTitle, validation, day, snackbar } = this.state;

        if (this.validateNotes()) {
            if (!day.notes) {
                day.notes = [];
            }

            day.notes.push({
                title: noteTitle,
                body: noteBody,
                time: moment().format('lll')
            });

            dayRef.set(day, error => {
                if (error) {
                    console.log('Add Note Error', error);
                } else {
                    this.queue.push({
                        message: 'Note Added',
                        key: new Date().getTime()
                    });

                    if (snackbar) {
                        // immediately begin dismissing current message
                        // to start showing new one
                        this.setState({ snackbar: false });
                    } else {
                        this.processQueue();
                    }

                    this.setState({ noteTitle: '', noteBody: '', addNote: false });
                    this.resetNoteValidation();
                }
            });
        } else {
            // If there is an invalid input, mark all as dirty on submit to alert the user
            for (let attr in validation.note) {
                if (validation['note'][attr]) {
                    validation['note'][attr].dirty = true;
                }
            }

            this.setState({ validation });
        }
    };

    renderMealBox() {
        const { data } = this.props;
        const { validation, day } = this.state;

        const validate = name => (validation[name].dirty && !validation[name].valid ? true : false);

        return (
            <div className="nutrition__overview--meals">
                <MealsHeader>
                    <span>Meals</span>
                    <span>{`${day.nutrition.calories} / ${data.user.goals.calories} cal`}</span>
                </MealsHeader>
                <MealForm className="add__meal" noValidate autoComplete="off">
                    <div className="add__meal--input">
                        <Input
                            name="name"
                            id="name"
                            label="Name"
                            required
                            onChange={this.onChange('name')}
                            error={validate('name')}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="servings"
                            id="servings"
                            label="Servings"
                            required
                            onChange={this.onChange('servings')}
                            error={validate('servings')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <div className="add__meal--input">
                        <Input
                            name="calories"
                            id="calories"
                            label="Calories"
                            type="number"
                            required
                            onChange={this.onChange('calories')}
                            error={validate('calories')}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="protein"
                            id="protein"
                            label="Protein"
                            type="number"
                            required
                            onChange={this.onChange('protein')}
                            error={validate('protein')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                    <div className="add__meal--input">
                        <Input
                            name="carbs"
                            id="carbs"
                            label="Carbs"
                            type="number"
                            required
                            onChange={this.onChange('carbs')}
                            error={validate('carbs')}
                            style={{
                                width: '45%'
                            }}
                        />
                        <Input
                            name="fat"
                            id="fat"
                            label="Fat"
                            type="number"
                            required
                            onChange={this.onChange('fat')}
                            error={validate('fat')}
                            style={{
                                width: '45%'
                            }}
                        />
                    </div>
                </MealForm>

                <Button
                    className="add__meal--save"
                    fullWidth
                    style={{ borderRadius: 0, height: 65, fontSize: 16 }}
                    onClick={this.onSubmit}
                    color="primary"
                    variant="raised"
                >
                    Add Meal
                </Button>
            </div>
        );
    }

    renderConfirmationDialog = () => {
        const { confirmationDialog, deleteMeal, day } = this.state;

        if (confirmationDialog) {
            const meal = day.nutrition.meals[deleteMeal];

            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={confirmationDialog}
                    onClose={() => this.setState({ confirmationDialog: false })}
                >
                    <DialogTitle>{`Remove "${meal.name}"`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove this entry?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.deleteMeal(deleteMeal)}
                            color="primary"
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => this.setState({ confirmationDialog: false })}
                            color="primary"
                            autoFocus
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    renderNoteConfirmationDialog = () => {
        const { noteConfirmationDialog, deleteNote, day } = this.state;

        if (noteConfirmationDialog) {
            const note = day.notes[deleteNote];

            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={noteConfirmationDialog}
                    onClose={() => this.setState({ noteConfirmationDialog: false })}
                >
                    <DialogTitle>{`Remove "${note.title}"`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove this note?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.deleteNote(deleteNote)}
                            color="primary"
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => this.setState({ noteConfirmationDialog: false })}
                            color="primary"
                            autoFocus
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    renderProgressBar(type) {
        const { data } = this.props;
        const { day } = this.state;

        let color;
        let progress;
        let text;

        if (type === 'protein') {
            color = '#F5729C';
            progress = day.nutrition.protein / data.user.goals.protein;
            text = day.nutrition.protein / data.user.goals.protein;
        } else if (type === 'carbs') {
            color = '#7BD4F8';
            progress = day.nutrition.carbs / data.user.goals.carbs;
            text = day.nutrition.carbs / data.user.goals.carbs;
        } else {
            color = '#55F3B3';
            progress = day.nutrition.fat / data.user.goals.fat;
            text = day.nutrition.fat / data.user.goals.fat;
        }
        text = `${Math.round(text * 100)}% of daily goal`;

        const options = {
            height: 25,
            color: color,
            trailColor: '#f4f4f4',
            containerStyle: {
                width: '80%',
                margin: '30px auto'
            },
            className: '',
            text: {
                value: text,
                style: {
                    fontSize: '1rem',
                    color: '#a2a7d9',
                    margin: '10px 0 0 0'
                }
            }
        };

        return <ProgressBar progress={progress} options={options} />;
    }

    renderNoteBox() {
        let { day } = this.state;
        let notes = [];

        for (let i in day.notes) {
            const note = day.notes[i];

            notes.push(
                <Note key={i} onClick={() => this.setState({ activeNote: note })}>
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
                                this.setState({
                                    editNote: true,
                                    noteToEdit: i,
                                    noteBody: note.body,
                                    noteTitle: note.title
                                });
                                e.stopPropagation();
                            }}
                        >
                            <i className="icon-edit" />
                        </IconButton>
                        <IconButton
                            onClick={e => {
                                this.setState({ noteConfirmationDialog: true, deleteNote: i });
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

        return (
            <div className="nutrition__overview--calories">
                <NotesHeader>
                    Notes{' '}
                    <Button
                        variant="fab"
                        color="primary"
                        aria-label="add note"
                        onClick={() => this.setState({ addNote: true })}
                        style={{ fontSize: 20 }}
                    >
                        <i className="icon-plus" />
                    </Button>
                </NotesHeader>

                <NoteContainer>{notes}</NoteContainer>
            </div>
        );
    }

    renderNote = () => {
        const { activeNote } = this.state;

        if (activeNote) {
            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={!!activeNote}
                    onClose={() => this.setState({ activeNote: null })}
                >
                    <DialogTitle>{`${activeNote.title} - ${activeNote.time}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{activeNote.body}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ activeNote: null })} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    renderAddNote = () => {
        const { addNote, validation } = this.state;

        const validate = name =>
            validation['note'][name].dirty && !validation['note'][name].valid ? true : false;

        if (addNote) {
            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={addNote}
                    onClose={() => {
                        this.resetNoteValidation();
                        this.setState({ addNote: false, noteTitle: '', noteBody: '' });
                    }}
                >
                    <DialogTitle>New Note</DialogTitle>
                    <DialogContent>
                        <div style={{ margin: '10px 0' }}>
                            <Input
                                name="noteTitle"
                                id="noteTitle"
                                label="Title"
                                required
                                fullWidth
                                onChange={this.onNoteChange('noteTitle')}
                                error={validate('noteTitle')}
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
                                onChange={this.onNoteChange('noteBody')}
                                error={validate('noteBody')}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.addNote} color="primary" variant="raised">
                            Save
                        </Button>
                        <Button
                            onClick={() => {
                                this.resetNoteValidation();
                                this.setState({ addNote: false, noteTitle: '', noteBody: '' });
                            }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    renderEditNote = () => {
        const { editNote, noteToEdit, day } = this.state;

        if (editNote) {
            const note = day.notes[noteToEdit];

            return (
                <Dialog
                    fullWidth
                    maxWidth={'sm'}
                    open={editNote}
                    onClose={() => {
                        this.resetNoteValidation();
                        this.setState({ editNote: false, noteTitle: '', noteBody: '' });
                    }}
                >
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogContent>
                        <div style={{ margin: '10px 0' }}>
                            <Input
                                name="noteTitle"
                                id="noteTitle"
                                label="Title"
                                fullWidth
                                defaultValue={note.title}
                                onChange={this.onNoteChange('noteTitle')}
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
                                defaultValue={note.body}
                                onChange={this.onNoteChange('noteBody')}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.editNote(noteToEdit)}
                            color="primary"
                            variant="raised"
                        >
                            Save
                        </Button>
                        <Button
                            onClick={() => {
                                this.resetNoteValidation();
                                this.setState({ editNote: false, noteTitle: '', noteBody: '' });
                            }}
                            color="primary"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    processQueue = () => {
        if (this.queue.length > 0) {
            this.setState({
                messageInfo: this.queue.shift(),
                snackbar: true
            });
        }
    };

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackbar: false });
    };

    handleExited = () => {
        this.processQueue();
    };

    render() {
        const { userData, data } = this.props;
        const { formattedDay, day, todayButton, messageInfo, snackbar } = this.state;
        const { message, key } = messageInfo;
        const { protein, carbs, fat } = day.nutrition || 0;

        return (
            <div>
                {!isEmpty(day) && !isEmpty(data) ? (
                    <div className="nutrition">
                        <HeaderWrapper>
                            <div>
                                <h1>Nutrition</h1>
                                <h3>{formattedDay.day.format('dddd, MMMM Do YYYY')}</h3>
                            </div>
                            <div>
                                {todayButton ? (
                                    <Button
                                        onClick={() => {
                                            this.setState(
                                                { today: true, requestedDate: null },
                                                () => {
                                                    this.mapDayToState(userData);
                                                }
                                            );
                                        }}
                                        color="primary"
                                        variant="outlined"
                                        size="large"
                                    >
                                        Go to Today
                                    </Button>
                                ) : null}
                            </div>
                        </HeaderWrapper>
                        <div className="nutrition__overview">
                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{protein}</h1>
                                    <span>g</span>
                                    <h3>Protein</h3>
                                </div>
                                {this.renderProgressBar('protein')}
                            </div>

                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{carbs}</h1>
                                    <span>g</span>
                                    <h3>Carbohydrates</h3>
                                </div>
                                {this.renderProgressBar('carbs')}
                            </div>

                            <div className="nutrition__overview--box">
                                <div className="nutrition__overview--head">
                                    <h1>{fat}</h1>
                                    <span>g</span>
                                    <h3>Fat</h3>
                                </div>
                                {this.renderProgressBar('fat')}
                            </div>
                        </div>
                        <div className="nutrition__overview">
                            {this.renderNoteBox()}
                            {this.renderMealBox()}
                        </div>
                        {this.renderMealsTable()}
                    </div>
                ) : (
                    'Loading...'
                )}
                <Snackbar
                    key={key}
                    anchorOrigin={snackbarOrigin}
                    open={snackbar}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                    onExited={this.handleExited}
                    message={<span id="message-id">{message}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            onClick={this.handleSnackbarClose}
                        >
                            <i className="icon-x2" style={{ color: 'white' }} />
                        </IconButton>
                    ]}
                />
                {this.renderConfirmationDialog()}
                {this.renderNoteConfirmationDialog()}
                {this.renderAddNote()}
                {this.renderEditNote()}
                {this.renderNote()}
            </div>
        );
    }
}

export default withFirebase(withRouter(connect(mapStateToProps)(Nutrition)));
