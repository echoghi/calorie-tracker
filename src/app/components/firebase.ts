import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
    apiKey: FIREBASEKEY,
    authDomain: AUTHDOMAIN,
    databaseURL: DATABASEURL,
    messagingSenderId: MESSAGINGSENDERID,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET
};

class Firebase {
    auth: firebase.auth.Auth;
    db: firebase.database.Database;
    googleProvider: firebase.auth.GoogleAuthProvider_Instance;
    fbProvider: firebase.auth.FacebookAuthProvider_Instance;
    emailProvider: firebase.auth.EmailAuthProvider_Instance;

    constructor() {
        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.db = firebase.database();
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.fbProvider = new firebase.auth.FacebookAuthProvider();
        this.emailProvider = new firebase.auth.EmailAuthProvider();
    }

    logIn(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logInWithCredential(credential: any) {
        return this.auth.signInWithCredential(credential);
    }

    logInWithGoogle() {
        return this.auth.signInWithPopup(this.googleProvider);
    }

    logInWithFacebook() {
        return this.auth.signInWithPopup(this.fbProvider);
    }

    logOut() {
        return this.auth.signOut();
    }

    resetPasswordRequest(email: string) {
        return this.auth.sendPasswordResetEmail(email);
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
