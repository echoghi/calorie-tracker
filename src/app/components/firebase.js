import firebase from 'firebase';
// Initialize Firebase
const config = {
	apiKey: 'AIzaSyAvzipfoqp3pei3BvDt4fp4oBTffr9QqsE',
	authDomain: 'health-dashboard-e6394.firebaseapp.com',
	databaseURL: 'https://health-dashboard-e6394.firebaseio.com',
	projectId: 'health-dashboard-e6394',
	storageBucket: '',
	messagingSenderId: '698208103192'
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;