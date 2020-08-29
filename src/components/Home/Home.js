import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Programs from "../Programs/Programs";
import ProgramContainer from "../ProgramContainer/ProgramContainer";
import Start, { StartProgram } from "../StartProgram/StartProgram";
import Exercises from "../Exercises/Exercises";
import ExerciseContainer from "../ExerciseContainer/ExerciseContainer";
import Routine from "../Routine/Routine";
import Profile from "../Profile/Profile";
import CreateProgram from "../CreateProgram/CreateProgram";
import EditProfile from "../Profile/EditProfile";

const Home = () => (
  <Router>
    <div className="router">
      <Navigation />
      {/* <Route exact path="/" render={() => (
                        <Redirect to="/programs"/>
                    )}/> */}
      <Route path="/programs" exact component={Programs} />
      <Route path="/exercises" exact component={Exercises} />
      <Route path="/routine" component={Routine} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/programs/:id" exact component={ProgramContainer} />
      <Route path="/programs/:id/:eventkey" component={StartProgram} />
      <Route path="/exercises/:name/:id" component={ExerciseContainer} />
      <Route path="/profile/createprogram" component={CreateProgram} />
      <Route path="/profile/editprofile" component={EditProfile} />
    </div>
  </Router>
);

export default Home;
