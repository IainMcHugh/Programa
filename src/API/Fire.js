import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBxQbFuPFIKCV4D1Gno4lzBN8CX9HIM_s8",
  authDomain: "program-46f7f.firebaseapp.com",
  databaseURL: "https://program-46f7f.firebaseio.com",
  projectId: "program-46f7f",
  storageBucket: "program-46f7f.appspot.com",
  messagingSenderId: "862377489435",
  appId: "1:862377489435:web:d0cb6d6c77ee729cd674be",
  measurementId: "G-HG0GBREHQW",
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.database = app.database();
  }

  // Authentication

  onAuthStateChange(callback) {
    return this.auth.onAuthStateChanged((user) => {
      user ? callback(user) : callback(null);
    });
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  register(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  checkUid(data) {
    return this.auth.currentUser.uid === data;
  }

  // Database - Profile

  addNewUser(currentUser, email, username) {
    this.database.ref("users/" + currentUser.uid).set({ email, username });
  }

  getUserData() {
    return this.database
      .ref("/users/" + this.auth.currentUser.uid)
      .once("value");
  }

  getUserSavedPrograms() {
    return this.database
      .ref("/users/" + this.auth.currentUser.uid + "/saved_programs/")
      .once("value");
  }

  // Database - Programs

  getRecentlyAddedPrograms() {
    return this.database
      .ref("/programs/")
      .orderByChild("timestamp")
      .limitToFirst(10)
      .once("value");
  }

  getTrendingPrograms() {
    return this.database
      .ref("/programs/")
      .orderByChild("rating")
      .limitToFirst(3)
      .once("value");
  }

  getProgram(programID) {
    return this.database.ref("/programs/" + programID).once("value");
  }

  createEvents(updates) {
    this.database
      .ref("users/" + this.auth.currentUser.uid + "/routine/")
      .update(updates);
  }

  saveProgram(updates) {
    this.database
      .ref("users/" + this.auth.currentUser.uid + "/saved_programs/")
      .update(updates);
  }

  removeSavedProgram(programID) {
    this.database
      .ref(
        "/users/" + this.auth.currentUser.uid + "/saved_programs/" + programID
      )
      .remove();
  }

  createProgramKey() {
    const pkey = this.database.ref().child("programs").push().key;
    return pkey;
  }

  async publishProgram(name, description, programEx) {
    const programKey = await this.createProgramKey();
    let program = {
      key: programKey,
      name: name,
      description: description,
      author: this.auth.currentUser.uid,
      rating: 0,
      review: 0,
      uses: 0,
      timestamp: Date.now(),
      exercises: programEx,
    };

    this.database.ref("programs/" + programKey).set(program);
    this.database
      .ref("users/" + this.auth.currentUser.uid + "/programs/" + programKey)
      .set(name);
    return programKey;
  }

  // Database - exercises

  getExercises() {
    return this.database.ref("/exercises/").orderByKey().once("value");
  }

  getExercise(exerciseID) {
    return this.database.ref("/exercises/" + exerciseID).once("value");
  }

  // Database - routine

  getUserRoutines() {
    return this.database
      .ref("/users/" + this.auth.currentUser.uid + "/routine")
      .once("value");
  }

  updateUserEvents(events) {
    this.database
      .ref("/users/" + this.auth.currentUser.uid + "/routine/")
      .set(events);
  }
}

export default new Firebase();
