import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyAvzipfoqp3pei3BvDt4fp4oBTffr9QqsE',
    authDomain: 'health-dashboard-e6394.firebaseapp.com',
    databaseURL: 'https://health-dashboard-e6394.firebaseio.com',
    messagingSenderId: '698208103192',
    projectId: 'health-dashboard-e6394',
    storageBucket: ''
};

class Firebase {
    auth: firebase.auth.Auth;
    db: firebase.database.Database;
    provider: firebase.auth.GoogleAuthProvider_Instance;

    constructor() {
        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.db = firebase.database();
        this.provider = new firebase.auth.GoogleAuthProvider();
    }

    logIn(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logInWithGoogle() {
        return this.auth.signInWithPopup(this.provider);
    }

    logOut() {
        return this.auth.signOut();
    }

    async register(name: string, email: string, password: string) {
        // create new user
        await this.auth.createUserWithEmailAndPassword(email, password);

        // save name
        return this.auth.currentUser.updateProfile({
            displayName: name,
            photoURL: this.auth.currentUser.photoURL
        });
    }
}

export default new Firebase();
