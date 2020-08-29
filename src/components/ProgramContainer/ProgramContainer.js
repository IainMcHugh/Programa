import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RRule, RRuleSet, rrulestr } from "rrule";
import fire from "../../API/Fire";

// class ProgramContainer extends React.Component {

//     constructor(props) {
//         super(props)

//         this.state = {
//              program_id: this.props.match.params.id,
//              program_name: '',
//              program_description: '',
//              program_author: '',
//              program_exercises: [],
//              navExercise: false,
//              navExerciseId: null,
//              navExerciseName: '',
//              savedPrograms: [],
//              isUsersProgram: false,
//              isSaveableProgram: true,
//              createEvent: false
//         }
//     }

//     componentDidMount() {
//         fire.auth().onAuthStateChanged( user => {
//             if (user) {
//                 let uid = user.uid;
//                 // let uid = fire.auth().currentUser.uid;
//                 let database = fire.database();
//                 let getSavedPrograms = this.state.savedPrograms;
//                 database.ref('/users/' + uid + '/saved_programs/').once('value').then((snap) => {
//                     snap.forEach((item) => {
//                         console.log(item.key);
//                         getSavedPrograms.push(item.key);
//                         console.log(getSavedPrograms);
//                     });

//                     database.ref('programs/' + this.state.program_id).once('value').then((snap) => {
//                         this.setState({
//                             program_name: snap.val().name,
//                             program_description: snap.val().description,
//                             program_exercises: snap.val().exercises,
//                             program_author: snap.val().author
//                         });

//                         if(snap.val().author == uid){
//                             console.log("THIS IS THE USERS PROGRAM")
//                             this.setState({
//                                 isUsersProgram: true
//                             })
//                         }
//                         else {
//                             // is this already saved?
//                             getSavedPrograms.forEach((savedProgram) => {
//                                 if(savedProgram == this.state.program_id){
//                                     console.log("User has already saved this program!")
//                                     this.setState({
//                                         isSaveableProgram: false
//                                     });
//                                 }
//                                 else{
//                                     console.log("This is not the users program and no match!")

//                                 }
//                             })
//                         }
//                     });

//                 });
//             }
//         });
//     }

//     saveProgram = (e) => {
//         let database = fire.database();
//         let uid = fire.auth().currentUser.uid;
//         var PostKey = this.state.program_id;
//         let updates = {};
//         updates['users/' + uid + '/saved_programs/' + PostKey] = this.state.program_name;
//         database.ref().update(updates);
//         alert("Program has been saved");

//         this.setState({
//             isSaveableProgram: false
//         })
//     }

//     removeSavedProgram = (e) => {
//         let database = fire.database();
//         let uid = fire.auth().currentUser.uid;
//         var PostKey = this.state.program_id;
//         database.ref('/users/' + uid + '/saved_programs/' + PostKey).remove()
//         alert("Program has been removed from your Saved");

//         this.setState({
//             isSaveableProgram: true
//         })
//     }

//     handleButtonPress = (e) => {
//         let savedTarget = e.currentTarget;
//         let targetName = savedTarget.getAttribute('name')
//         this.timeout = setTimeout(() =>{
//             console.log(savedTarget.getAttribute('name'));
//             this.setState({
//                 navExerciseId: savedTarget.getAttribute('id'),
//                 navExerciseName: targetName,
//                 navExercise: true
//             });
//             }, 800);

//         console.log("A TEST: "+targetName);

//     }

//     handleButtonRelease = () => {
//         clearTimeout(this.timeout);
//     }

//     eventCreater = () => {
//         this.setState({
//             createEvent: true
//         })
//     }

//     addEvent = (e) => {
//         e.preventDefault();
//         console.log(e.target.elements.repeat.value); //norepeat or yesrepeat
//         let repeatValue = e.target.elements.repeat.value;
//         let startDateHolder = new Date(e.target.elements.beginentry.value);
//         let startDateHolderYear = startDateHolder.getFullYear();
//         let startDateHolderMonth = startDateHolder.getMonth();
//         let startDateHolderDate = startDateHolder.getDate();
//         let startDateHolderHour = startDateHolder.getHours();
//         let startDateHolderMinutes = startDateHolder.getMinutes();
//         let endDateHolder = new Date(e.target.elements.endentry.value);
//         let endDateHolderYear = endDateHolder.getFullYear();
//         let endDateHolderMonth = endDateHolder.getMonth();
//         let endDateHolderDate = endDateHolder.getDate();
//         let endDateHolderHour = endDateHolder.getHours();
//         let endDateHolderMinutes = endDateHolder.getMinutes();

//         let database = fire.database();
//         let uid = fire.auth().currentUser.uid;
//         var PostKey = this.state.program_id;
//         var PostName = this.state.program_name;
//         let updates = {};
//         let prevChildCount = 0
//         // have to get count from routine child
//         database.ref('users/' + uid + '/routine').once('value').then((snap) => {
//             prevChildCount = snap.numChildren();
//             console.log(prevChildCount);

//             if (repeatValue === 'yesrepeat'){

//                 const ruleStart = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(startDateHolderYear, startDateHolderMonth, startDateHolderDate, startDateHolderHour, startDateHolderMinutes)),
//                     count: 10
//                 });

//                 const ruleEnd = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(endDateHolderYear, endDateHolderMonth, endDateHolderDate, endDateHolderHour, endDateHolderMinutes)),
//                     count: 10
//                 });

//                 let startRepeat = ruleStart.all();
//                 let startEnd = ruleEnd.all();

//                 for (let i=0; i < startRepeat.length; i++){
//                     let newEventHolder = {
//                         'id': PostKey,
//                         'title': PostName,
//                         'start': startRepeat[i],
//                         'end': startEnd[i],
//                         'desc': this.state.program_description,
//                         'isrepeat': true,
//                         'repeat_start': prevChildCount,
//                         'repeat_end': ((startRepeat.length -1) + prevChildCount)
//                     }
//                     updates['users/' + uid + '/routine/' + (i + prevChildCount) + '/'] = newEventHolder;
//                     database.ref().update(updates);

//                 }

//                 alert("Event Created!");

//                 this.setState({
//                     createEvent: false
//                 })
//             }
//             else
//             {
//                 const ruleStart = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(startDateHolderYear, startDateHolderMonth, startDateHolderDate, startDateHolderHour, startDateHolderMinutes)),
//                     count: 1
//                 });

//                 const ruleEnd = new RRule({
//                     freq: RRule.WEEKLY,
//                     interval: 1,
//                     dtstart: new Date(Date.UTC(endDateHolderYear, endDateHolderMonth, endDateHolderDate, endDateHolderHour, endDateHolderMinutes)),
//                     count: 1
//                 });

//                 let startRepeat = ruleStart.all();
//                 let startEnd = ruleEnd.all();

//                 let newEventHolder = {
//                     'id': PostKey,
//                     'title': PostName,
//                     'start': startRepeat[0],
//                     'end': startEnd[0],
//                     'desc': this.state.program_description,
//                     'isrepeat': false,
//                     'isdone': false,
//                 }
//                 console.log(prevChildCount);
//                 updates['users/' + uid + '/routine/' + prevChildCount + '/'] = newEventHolder;
//                 database.ref().update(updates);

//                 alert("Event Created!");

//                 this.setState({
//                     createEvent: false
//                 })
//             }
//         })
//     }

//     render() {
//         const { program_name, program_description, program_exercises, navExercise, navExerciseId, navExerciseName, isSaveableProgram ,isUsersProgram, createEvent } = this.state
//         console.log(program_exercises);
//         return (
//             <div className='programContainer-background'>
//                 <div className='programContainer-container'>
//                     <h2>{program_name}</h2>
//                     <h3>{program_description}</h3>
//                     <div className='programContainer-exercise'>
//                                 <h4 className='programContainer-exercise-heading'>Exercise</h4>
//                                 <h4 className='programContainer-exercise-heading'>Sets</h4>
//                                 <h4 className='programContainer-exercise-heading'>Reps</h4>
//                             </div>
//                     {
//                         program_exercises.map((exercise) => {
//                             return(
//                             <div key={exercise.key} id={exercise.id} name={exercise.name} className='programContainer-exercise' onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}>
//                                 <h4 className='programContainer-exercise-body'>{exercise.name}<br/>( {exercise.methods} - {exercise.positions})</h4>
//                                 <h4 className='programContainer-exercise-body'>{exercise.sets}</h4>
//                                 <h4 className='programContainer-exercise-body'>{exercise.reps}</h4>
//                             </div>)
//                         })
//                         // program_exercises.keys.map((program_exercise) => {
//                         //     console.log(program_exercise);
//                         // })
//                     }
//                 </div>
//                 { navExercise ?
//                     <div className='deleteExercise-container' id={navExerciseId}>
//                         <Link to={'/exercises/' + navExerciseName + '/' + navExerciseId}><button>Navigate to this Exercise</button></Link>
//                         <button onClick={()=>{this.setState({navExercise: null});}}>Cancel</button>
//                     </div>
//                     :
//                     <div></div>
//                 }
//                 { createEvent ?
//                     <div className='createEvent-container'>
//                         <form onSubmit={this.addEvent}>
//                             <h2 className='createEvent-heading'>{program_name}</h2>
//                             <label>Start Date</label>
//                             <input type='datetime-local' defaultValue="2020-03-26T13:30" required name='beginentry' id='start-date'/>
//                             <label>End Date</label>
//                             <input type='datetime-local' defaultValue="2020-03-26T14:30" required name='endentry' id='create-event-end-date'/>

//                             <p>Repeat Event</p>
//                             <input type='radio' id='yesrepeat' name='repeat' value='yesrepeat' />
//                             <label for='yesrepeat'>Repeat</label>
//                             <input type='radio' id='norepeat' name='repeat' value='norepeat' defaultChecked />
//                             <label for='norepeat'>Dont Repeat</label>
//                             <button type='submit'>Add to Calendar</button>
//                             {/* <button type='button' onClick={()=>this.setState({createEvent: false})}>Cancel</button> */}
//                         </form>
//                     </div>
//                     :
//                     <div></div>
//                 }
//                 {
//                     !isUsersProgram ?
//                         isSaveableProgram ?
//                             <div>
//                                 <button onClick={this.saveProgram}>Save this Program</button>
//                             </div>
//                             :
//                             <div>
//                                 <button onClick={this.removeSavedProgram}>Remove this Program from your Saved Programs</button>
//                             </div>
//                         :
//                         <div></div>
//                 }
//                 <button onClick={this.eventCreater}>Add to your Calendar</button>
//             </div>
//         )
//     }
// }

const ProgramContainer = (props) => {
  const [program, setProgram] = useState();
  //         this.state = {
  //              program_id: this.props.match.params.id,
  //              program_name: '',
  //              program_description: '',
  //              program_author: '',
  //              program_exercises: [],
  //              navExercise: false,
  //              navExerciseId: null,
  //              navExerciseName: '',
  //              savedPrograms: [],
  //              isUsersProgram: false,
  //              isSaveableProgram: true,
  //              createEvent: false
  //         }

  useEffect(() => {
    fire
      .getProgram(props.match.params.id)
      .then((data) => setProgram(data.val()));
  }, []);

  const handleButtonPress = (e) => {
    let targetName = e.currentTarget.getAttribute("name");
    // this.timeout = setTimeout(() => {
    //   console.log(savedTarget.getAttribute("name"));
    //   this.setState({
    //     navExerciseId: savedTarget.getAttribute("id"),
    //     navExerciseName: targetName,
    //     navExercise: true,
    //   });
    // }, 800);

    console.log("A TEST: " + targetName);
  };

  const handleButtonRelease = () => {
    // clearTimeout(this.timeout);
    console.log("Another test")
  };

  return (
    <div className="programContainer-background">
      {program && (
        <div className="programContainer-container">
          <h2>{program.name}</h2>
          <h3>{program.description}</h3>
          <div className="programContainer-exercise">
            <h4 className="programContainer-exercise-heading">Exercise</h4>
            <h4 className="programContainer-exercise-heading">Sets</h4>
            <h4 className="programContainer-exercise-heading">Reps</h4>
          </div>
          {program.exercises.map((exercise) => {
            return (
              <div
                key={exercise.key}
                id={exercise.id}
                name={exercise.name}
                className="programContainer-exercise"
                onMouseDown={() => handleButtonPress()}
                onMouseUp={() => handleButtonRelease()}
              >
                <h4 className="programContainer-exercise-body">
                  {exercise.name}
                  <br />( {exercise.methods} - {exercise.positions})
                </h4>
                <h4 className="programContainer-exercise-body">
                  {exercise.sets}
                </h4>
                <h4 className="programContainer-exercise-body">
                  {exercise.reps}
                </h4>
              </div>
            );
          })}
        </div>
      )}

      {/* {navExercise ? (
        <div className="deleteExercise-container" id={navExerciseId}>
          <Link to={"/exercises/" + navExerciseName + "/" + navExerciseId}>
            <button>Navigate to this Exercise</button>
          </Link>
          <button
            onClick={() => {
              this.setState({ navExercise: null });
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div></div>
      )} */}
      {/* {createEvent ? (
        <div className="createEvent-container">
          <form onSubmit={this.addEvent}>
            <h2 className="createEvent-heading">{program_name}</h2>
            <label>Start Date</label>
            <input
              type="datetime-local"
              defaultValue="2020-03-26T13:30"
              required
              name="beginentry"
              id="start-date"
            />
            <label>End Date</label>
            <input
              type="datetime-local"
              defaultValue="2020-03-26T14:30"
              required
              name="endentry"
              id="create-event-end-date"
            />

            <p>Repeat Event</p>
            <input
              type="radio"
              id="yesrepeat"
              name="repeat"
              value="yesrepeat"
            />
            <label for="yesrepeat">Repeat</label>
            <input
              type="radio"
              id="norepeat"
              name="repeat"
              value="norepeat"
              defaultChecked
            />
            <label for="norepeat">Dont Repeat</label>
            <button type="submit">Add to Calendar</button>
            </form>
        </div>
      ) : (
        <div></div>
      )} */}
      {/* {!isUsersProgram ? (
        isSaveableProgram ? (
          <div>
            <button onClick={this.saveProgram}>Save this Program</button>
          </div>
        ) : (
          <div>
            <button onClick={this.removeSavedProgram}>
              Remove this Program from your Saved Programs
            </button>
          </div>
        )
      ) : (
        <div></div>
      )} */}
      {/* <button onClick={this.eventCreater}>Add to your Calendar</button> */}
    </div>
  );
};

export default ProgramContainer;
