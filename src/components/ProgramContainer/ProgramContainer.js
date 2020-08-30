import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {RRules} from "../RRules/RRules";
import fire from "../../API/Fire";

const ProgramContainer = (props) => {
  const [program, setProgram] = useState();
  const [navExerciseName, setNavExerciseName] = useState("");
  const [navExerciseId, setNavExerciseId] = useState("");
  const [createEvent, setCreateEvent] = useState(false);
  const [usersProgram, setUsersProgram] = useState(false);
  const [savedProgram, setSavedProgram] = useState(false);

  useEffect(() => {
    fire.getProgram(props.match.params.id).then((data) => {
      setProgram(data.val());
      if (fire.checkUid(data.val().author)) {
        setUsersProgram(true);
      } else {
        // User did not create this program, check if saved
        fire.getUserSavedPrograms().then((savedPrograms) => {
          setSavedProgram(
            Object.keys(savedPrograms.val()).includes(props.match.params.id)
          );
        }).catch(err => console.log(err));
      }
    });
  }, []);

  const handleButtonPress = (e) => {
    const { id, title } = e.target;
    setNavExerciseId(id);
    setNavExerciseName(title);
  };

  const handleButtonRelease = () => {
    setNavExerciseId(null);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const repeatValue = e.target.elements.repeat.value;
    const start = new Date(e.target.elements.beginentry.value);
    const end = new Date(e.target.elements.endentry.value);

    fire.getUserRoutines().then((data) => {
      let dataLength = data.numChildren();
      let updates = {};
      if (repeatValue === "yesrepeat") {
        let updates = {};

        const startCollection = RRules(start, 10);
        const endCollection = RRules(end, 10);

        startCollection.forEach((start, index) => {
          let newEvent = {
            key: index + dataLength,
            id: props.match.params.id,
            title: program.name,
            start: start,
            end: endCollection[index],
            desc: program.description,
            isrepeat: true,
            isdone: false,
            repeat_start: dataLength,
            repeat_end: startCollection.length - 1 + dataLength,
          };
          updates[`${index + dataLength}/`] = newEvent;
        });
        fire.createEvents(updates);
        alert("Repeat Events added to your Calendar!");
      } 
      
      else {
        console.log("Not a Repeat Event");

        const startCollection = RRules(start, 1);
        const endCollection = RRules(end, 1);

        let newEvent = {
          key: dataLength,
          id: props.match.params.id,
          title: program.name,
          start: startCollection[0],
          end: endCollection[0],
          desc: program.description,
          isrepeat: false,
          isdone: false,
        };
        updates[`${dataLength}/`] = newEvent;
        console.log("Updates Object:");
        console.log(updates);
        fire.createEvents(updates);

        alert("Event added to your Calendar!");
      }
      setCreateEvent(false);
    });
  };

  const handleSaveProgram = () => {
    console.log("Handle Save Program");
    let updates = {};
    updates[props.match.params.id] = program.name;
    fire.saveProgram(updates);
    setSavedProgram(true);
  };

  const handleRemoveProgram = () => {
    console.log("Handle Remove Saved Program");
    fire.removeSavedProgram(props.match.params.id);
    setSavedProgram(false);
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
                title={exercise.name}
                className="programContainer-exercise"
                onClick={(e) => handleButtonPress(e)}
              >
                <h4
                  id={exercise.id}
                  title={exercise.name}
                  className="programContainer-exercise-body"
                >
                  {exercise.name}
                  <br />( {exercise.methods} - {exercise.positions})
                </h4>
                <h4
                  id={exercise.id}
                  title={exercise.name}
                  className="programContainer-exercise-body"
                >
                  {exercise.sets}
                </h4>
                <h4
                  id={exercise.id}
                  title={exercise.name}
                  className="programContainer-exercise-body"
                >
                  {exercise.reps}
                </h4>
              </div>
            );
          })}
        </div>
      )}

      {navExerciseId && (
        <div className="deleteExercise-container" id={navExerciseId}>
          <Link to={"/exercises/" + navExerciseName + "/" + navExerciseId}>
            <button>Navigate to this Exercise</button>
          </Link>
          <button onClick={() => setNavExerciseId(null)}>Cancel</button>
        </div>
      )}
      {createEvent && (
        <div className="createEvent-container">
          <form onSubmit={(e) => handleCreateEvent(e)}>
            <h2 className="createEvent-heading">{program.name}</h2>
            <label htmlFor="beginentry">Start Date</label>
            <input
              type="datetime-local"
              defaultValue="2020-08-31T12:00"
              required
              name="beginentry"
              id="start-date"
            />
            <label htmlFor="endentry">End Date</label>
            <input
              type="datetime-local"
              defaultValue="2020-08-31T13:00"
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
            <label htmlFor="yesrepeat">Repeat</label>
            <input
              type="radio"
              id="norepeat"
              name="repeat"
              value="norepeat"
              defaultChecked
            />
            <label htmlFor="norepeat">Dont Repeat</label>
            <button type="submit">Add to Calendar</button>
          </form>
        </div>
      )}
      {!usersProgram &&
        (!savedProgram ? (
          <div>
            <button onClick={() => handleSaveProgram()}>
              Save this Program
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => handleRemoveProgram()}>
              Remove this Program from your Saved Programs
            </button>
          </div>
        ))}
      <button onClick={() => setCreateEvent(true)}>Add to your Calendar</button>
    </div>
  );
};

export default ProgramContainer;