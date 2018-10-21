import React from 'react';
import { database } from '../firebase.js';
import moment from 'moment';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const loadDay = (userData, requestedDate) => {
    let day;
    let dayIndex;
    let formattedDay;
    let result;
    let todayButton = true;

    if (requestedDate) {
        const queryRef = database
            .ref('users')
            .child(userData.uid)
            .child('calendar')
            .orderByChild('day');

        queryRef.once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                day = childSnapshot.val();
                formattedDay = childSnapshot.val();
                dayIndex = childSnapshot.key;

                const { year, date, month } = day.day;
                formattedDay.day = moment([year, month, date]);

                if (
                    formattedDay.day.date() === requestedDate.date() &&
                    formattedDay.day.month() === requestedDate.month() &&
                    formattedDay.day.year() === requestedDate.year()
                ) {
                    // If requestedDate is Today, disable the today button
                    if (
                        moment().date() === requestedDate.date() &&
                        moment().month() === requestedDate.month() &&
                        moment().year() === requestedDate.year()
                    ) {
                        todayButton = false;
                    }

                    const dayRef = database
                        .ref('users')
                        .child(userData.uid)
                        .child(`calendar/${dayIndex}`);

                    result = {
                        day,
                        formattedDay,
                        requestedDate,
                        dayRef,
                        dayIndex,
                        todayButton
                    };
                }
            });
        });
    } else {
        const queryRef = database
            .ref('users')
            .child(userData.uid)
            .child('calendar')
            .orderByChild('day')
            .limitToLast(1);

        queryRef.once('value', snapshot => {
            day = snapshot.val();
            dayIndex = Object.keys(day)[0];
            formattedDay = Object.assign({}, day[dayIndex]);
            day = day[dayIndex];

            const { year, date, month } = day.day;
            formattedDay.day = moment([year, month, date]);

            const dayRef = database
                .ref('users')
                .child(userData.uid)
                .child(`calendar/${dayIndex}`);

            result = {
                day,
                formattedDay,
                dayRef,
                dayIndex,
                todayButton: false,
                requestedDate: null
            };
        });
    }

    return result;
};

/**
 * HOC to Provide Access to Firebase
 *
 * @param WrappedComponent
 * @return withFirebase
 */
const withFirebase = WrappedComponent => {
    const withFirebase = props => <WrappedComponent loadDay={loadDay} {...props} />;

    withFirebase.displayName = `withFirebase(${getDisplayName(WrappedComponent)})`;

    return withFirebase;
};

export default withFirebase;
