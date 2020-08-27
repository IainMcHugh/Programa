import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import Navigation from './Navigation';
import Programs from './Programs';
import ProgramContainer from './ProgramContainer';
import Start, { StartProgram } from './StartProgram';
import Exercises from './Exercises';
import ExerciseContainer from './ExerciseContainer';
import Routine from './Routine';
import Profile from './Profile';
import CreateProgram from './CreateProgram';
import EditProfile from './EditProfile';

export class Home extends Component {

    render() {
        return (
            <Router>
                <div className='router'>
                    <Navigation />
                    {/* <Route exact path="/" render={() => (
                        <Redirect to="/programs"/>
                    )}/> */}
                    <Route path="/programs" exact component={Programs} />
                    <Route path="/exercises" exact component={Exercises} />
                    <Route path="/routine" component={Routine} />
                    <Route path="/profile" exact component={Profile} />
                    <Route path="/profile/createprogram" component={CreateProgram} />
                    <Route path="/profile/editprofile" component={EditProfile} />
                    <Route path="/exercises/:name/:id" component={ExerciseContainer} />
                    <Route path="/programs/:id" exact component={ProgramContainer} />
                    <Route path="/programs/:id/:eventkey" component={StartProgram} />
                </div>
            </Router>
        )
    }
}

export default Home
