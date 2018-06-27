import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { database } from './firebase.js';
import moment from 'moment';
import queryString from 'query-string';
// Components
import Input from './Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
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

// Reusable validation constuctor for each input
let inputObj = required => {
    this.valid = required ? false : true;
    this.dirty = false;
};

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

class Nutrition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            now: moment(),
            day: {},
            user: {},
            loading: true,

            mealTypes: [],
            validation: {
                name: new inputObj(true),
                type: new inputObj(),
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

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        const { userData } = this.props;

        if (!_.isEmpty(userData)) {
            this.mapDayToState(userData);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userData } = this.props;

        if (userData !== nextProps.userData && !_.isEmpty(nextProps.userData)) {
            this.mapDayToState(nextProps.userData);
        }
    }

    mapDayToState = (userData, today) => {
        const { location, history } = this.props;
        let { day, user, meals, mealTypes } = this.state;
        let requestedDate = null;

        if (location.search) {
            const parsed = queryString.parse(location.search);
            requestedDate = parseInt(parsed.d);
        }

        let dayIndex;

        requestedDate = requestedDate ? moment(requestedDate) : null;

        const callback = state => {
            this.setState(state);
        };

        const userRef = database
            .ref('users')
            .child(userData.uid)
            .child('user');

        userRef.once('value', snapshot => {
            user = snapshot.val();
            callback({ user });
        });

        const mealTypeRef = database
            .ref('users')
            .child(userData.uid)
            .child('mealTypes');

        mealTypeRef.on('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                let mealType = childSnapshot.val();
                mealTypes.push(mealType.type);
            });

            callback({ mealTypes });
        });

        const loadToday = () => {
            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child('calendar')
                .orderByChild('day')
                .limitToLast(1);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
                dayIndex = Object.keys(day)[0];

                day = day[dayIndex];

                const { year, date, month } = day.day;
                day.day = moment([year, month, date]);

                const mealsRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child(`calendar/${dayIndex}/nutrition/meals`);

                mealsRef.on('value', snapshot => {
                    meals = snapshot.val();

                    callback({ meals, day, loading: false, dayIndex, todayButton: true, requestedDate: null });
                });
            });
        };

        if (!today) {
            if (requestedDate) {
                const queryRef = database
                    .ref('users')
                    .child(userData.uid)
                    .child('calendar')
                    .orderByChild('day');

                queryRef.on('value', snapshot => {
                    snapshot.forEach(childSnapshot => {
                        day = childSnapshot.val();

                        dayIndex = childSnapshot.key;

                        const { year, date, month } = day.day;
                        day.day = moment([year, month, date]);

                        if (
                            day.day.date() === requestedDate.date() &&
                            day.day.month() === requestedDate.month() &&
                            day.day.year() === requestedDate.year()
                        ) {
                            const mealsRef = database
                                .ref('users')
                                .child(userData.uid)
                                .child(`calendar/${dayIndex}/nutrition/meals`);

                            mealsRef.on('value', snapshot => {
                                meals = snapshot.val();

                                callback({ meals, day, loading: false, requestedDate, dayIndex, todayButton: false });
                            });
                        }
                    });
                });
            } else {
                loadToday();
            }
        } else {
            history.push('/nutrition');

            loadToday();
        }
    };

    renderMealsTable() {
        const { meals, sorted } = this.state;

        return (
            <ReactTable
                style={tableStyle.table}
                ref={instance => (this.tableInstance = instance)}
                data={meals || []}
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
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Type',
                        accessor: 'type',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                    <i className={getSortedComponentClass(sorted, props.column.id)} />
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
            <IconButton onClick={() => this.setState({ confirmationDialog: true, deleteMeal: index })}>
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    deleteMeal = index => {
        const { userData } = this.props;
        const { dayIndex } = this.state;

        let day;

        const queryRef = database
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${dayIndex}`);

        queryRef.on('value', snapshot => {
            day = snapshot.val();
        });

        const meal = day.nutrition.meals[index];

        day.nutrition.calories -= meal.calories;
        day.nutrition.protein -= meal.protein;
        day.nutrition.fat -= meal.fat;
        day.nutrition.carbs -= meal.carbs;

        day.nutrition.meals = day.nutrition.meals.filter(meal => meal !== day.nutrition.meals[index]);

        queryRef.update(day);

        this.setState({ confirmationDialog: false, deleteMeal: null });
    };

    deleteNote = index => {
        const { userData } = this.props;
        const { dayIndex } = this.state;

        let day;

        const queryRef = database
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${dayIndex}`);

        queryRef.on('value', snapshot => {
            day = snapshot.val();
        });

        day.notes = day.notes.filter(note => note !== day.notes[index]);

        queryRef.update(day);

        this.setState({ noteConfirmationDialog: false });
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

    onChange = name => event => {
        const obj = _.cloneDeep(this.state);
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
        const obj = _.cloneDeep(this.state);
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
        let { dayIndex, name, type, calories, fat, carbs, protein, validation, meals } = this.state;
        const { userData } = this.props;

        if (this.validateInputs()) {
            let day;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            const mealsRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}/nutrition/meals`);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
            });

            day.nutrition.calories += parseInt(calories);
            day.nutrition.fat += parseInt(fat);
            day.nutrition.protein += parseInt(protein);
            day.nutrition.carbs += parseInt(carbs);

            document.getElementById('name').value = '';
            document.getElementById('type').value = '';
            document.getElementById('calories').value = '';
            document.getElementById('carbs').value = '';
            document.getElementById('fat').value = '';
            document.getElementById('protein').value = '';

            this.setState({ calories: '', fat: '', carbs: '', protein: '', name: '', type: '' }, () => {
                queryRef.update(day);

                this.resetMealValidation();

                if (!meals) {
                    meals = [];
                }

                meals.push({
                    name,
                    type,
                    calories: parseFloat(calories),
                    fat: parseFloat(fat),
                    protein: parseFloat(protein),
                    carbs: parseFloat(carbs)
                });

                mealsRef.update(meals);
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
        let { dayIndex, noteBody, noteTitle, validation } = this.state;
        const { userData } = this.props;

        if (this.validateNotes()) {
            let day;

            const queryRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            queryRef.on('value', snapshot => {
                day = snapshot.val();
            });

            if (!day.notes) {
                day.notes = [];
            }

            day.notes.push({
                title: noteTitle,
                body: noteBody,
                time: moment().format('h:mm a')
            });

            this.setState({ noteTitle: '', noteBody: '', addNote: false }, () => {
                queryRef.update(day);

                this.resetNoteValidation();
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
        const { validation, day, user } = this.state;

        const validate = name => (validation[name].dirty && !validation[name].valid ? true : false);

        return (
            <div className="nutrition__overview--meals">
                <MealsHeader>
                    <span>Log Meals</span>
                    <span>{`${day.nutrition.calories} / ${user.goals.calories} cal`}</span>
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
                            name="type"
                            id="type"
                            label="Type"
                            required
                            onChange={this.onChange('type')}
                            error={validate('type')}
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

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

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
                        <DialogContentText>Are you sure you want to remove this entry?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={buttonStyle}
                            onClick={() => this.deleteMeal(deleteMeal)}
                            color="primary"
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button
                            style={buttonStyle}
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

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

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
                        <DialogContentText>Are you sure you want to remove this note?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={buttonStyle}
                            onClick={() => this.deleteNote(deleteNote)}
                            color="primary"
                            variant="raised"
                        >
                            Delete
                        </Button>
                        <Button
                            style={buttonStyle}
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
        const { day, user } = this.state;

        let color;
        let progress;
        let text;

        if (type === 'protein') {
            color = '#F5729C';
            progress = day.nutrition.protein / user.goals.protein;
            text = day.nutrition.protein / user.goals.protein;
        } else if (type === 'carbs') {
            color = '#7BD4F8';
            progress = day.nutrition.carbs / user.goals.carbs;
            text = day.nutrition.carbs / user.goals.carbs;
        } else {
            color = '#55F3B3';
            progress = day.nutrition.fat / user.goals.fat;
            text = day.nutrition.fat / user.goals.fat;
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
                        <span>{`${note.body.substring(0, 30)}...`}</span>
                        <span>{note.time}</span>
                    </NoteBody>
                    <NoteActions>
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
                    Daily Notes{' '}
                    <Button
                        variant="fab"
                        color="primary"
                        aria-label="add note"
                        onClick={() => this.setState({ addNote: true })}
                    >
                        <i className="icon-edit-2" />
                    </Button>
                </NotesHeader>

                <NoteContainer>{notes}</NoteContainer>
            </div>
        );
    }

    renderNote = () => {
        const { activeNote } = this.state;

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

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
                        <Button style={buttonStyle} onClick={() => this.setState({ activeNote: null })} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    };

    renderAddNote = () => {
        const { addNote, validation } = this.state;

        const validate = name => (validation['note'][name].dirty && !validation['note'][name].valid ? true : false);

        const buttonStyle = {
            fontSize: 14,
            height: 43
        };

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
                        <Button style={buttonStyle} onClick={this.addNote} color="primary" variant="raised">
                            Save
                        </Button>
                        <Button
                            style={buttonStyle}
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

    render() {
        const { userData } = this.props;
        const { day, user, todayButton, loading } = this.state;
        const { protein, carbs, fat } = day.nutrition || 0;

        return (
            <div>
                {!loading && !_.isEmpty(day) && !_.isEmpty(user) ? (
                    <div className="nutrition">
                        <HeaderWrapper>
                            <div>
                                <h1>Nutrition</h1>
                                <h3>{day.day.format('dddd, MMMM Do YYYY')}</h3>
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        this.mapDayToState(userData, true);
                                    }}
                                    color="primary"
                                    variant="outlined"
                                    size="large"
                                    disabled={todayButton}
                                >
                                    Today
                                </Button>
                            </div>
                        </HeaderWrapper>
                        <div className="nutrition__overview">
                            <Fade in={true}>
                                <div className="nutrition__overview--box">
                                    <div className="nutrition__overview--head">
                                        <h1>{protein}</h1>
                                        <span>g</span>
                                        <h3>Protein</h3>
                                    </div>
                                    {this.renderProgressBar('protein')}
                                </div>
                            </Fade>
                            <Fade in={true}>
                                <div className="nutrition__overview--box">
                                    <div className="nutrition__overview--head">
                                        <h1>{carbs}</h1>
                                        <span>g</span>
                                        <h3>Carbohydrates</h3>
                                    </div>
                                    {this.renderProgressBar('carbs')}
                                </div>
                            </Fade>
                            <Fade in={true}>
                                <div className="nutrition__overview--box">
                                    <div className="nutrition__overview--head">
                                        <h1>{fat}</h1>
                                        <span>g</span>
                                        <h3>Fat</h3>
                                    </div>
                                    {this.renderProgressBar('fat')}
                                </div>
                            </Fade>
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
                {this.renderConfirmationDialog()}
                {this.renderNoteConfirmationDialog()}
                {this.renderAddNote()}
                {this.renderNote()}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Nutrition));
