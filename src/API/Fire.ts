import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

interface Configs {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Your web app's Firebase configuration
var firebaseConfig: Configs = {
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
  private auth: firebase.auth.Auth;
  private database: firebase.database.Database;
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.database = app.database();
  }

  // Authentication

  onAuthStateChange(callback: any) {
    return this.auth.onAuthStateChanged((user) => {
      user ? callback(user) : callback(null);
    });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  checkUid(data: string) {
    if(this.auth.currentUser){
      return this.auth.currentUser.uid === data
    } else {
      return -1;
    }
  }

  // Database - Profile

  addNewUser(currentUser: firebase.User | null, email: string, username: string) {
    if(currentUser) this.database.ref("users/" + currentUser.uid).set({ email, username });
  }

  getUserData() {
    if(this.auth.currentUser){
      return this.database
      .ref("/users/" + this.auth.currentUser.uid)
      .once("value");
    } else {
      throw new Error("Could not get User data");
    }
    
  }

  getUserSavedPrograms() {
    if(this.auth.currentUser){
      return this.database
      .ref("/users/" + this.auth.currentUser.uid + "/saved_programs/")
      .once("value");
    } else {
      throw new Error("Could not receive User Saved Programs");
    }
    
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

  getProgram(programID: string) {
    return this.database.ref("/programs/" + programID).once("value");
  }

  createEvents(updates: any) {
    if(this.auth.currentUser){
      this.database
      .ref("users/" + this.auth.currentUser.uid + "/routine/")
      .update(updates);
    } else {
      return -1;
    }
    
  }

  saveProgram(updates: any) {
    if(this.auth.currentUser){
      this.database
      .ref("users/" + this.auth.currentUser.uid + "/saved_programs/")
      .update(updates);
    } else {
      return -1;
    }
    
  }

  removeSavedProgram(programID: string) {
    if(this.auth.currentUser){
      this.database
      .ref(
        "/users/" + this.auth.currentUser.uid + "/saved_programs/" + programID
      )
      .remove();
    } else {
      return -1;
    }
    
  }

  createProgramKey() {
    const pkey = this.database.ref().child("programs").push().key;
    return pkey;
  }

  async publishProgram(name: string, description: string, programEx: any) {
    if(this.auth.currentUser){
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
    } else {
      return -1;
    }
    
  }

  completeProgram(pKey: string, start: string, end: string) {
    if(this.auth.currentUser){
      return this.database
      .ref("users/" + this.auth.currentUser.uid + "/routine/" + pKey)
      .update({
        isdone: true,
        start: start,
        end: end,
      });
    } else {
      throw new Error("Could not update User data with completed Program.");
    }
  }

  // Database - exercises

  getExercises() {
    return this.database.ref("/exercises/").orderByKey().once("value");
  }

  getExercise(exerciseID: string) {
    return this.database.ref("/exercises/" + exerciseID).once("value");
  }

  // Database - routine

  getUserRoutines() {
    if(this.auth.currentUser) {
      return this.database
        .ref("/users/" + this.auth.currentUser.uid + "/routine")
        .once("value");
    } else {
      throw new Error("Could not recieve User Routines");
    }
  }

  updateUserEvents(events: any) {
    if(this.auth.currentUser) {
      this.database
        .ref("/users/" + this.auth.currentUser.uid + "/routine/")
        .set(events);
    } else {
      return -1;
    }
  }
}

export default new Firebase();
