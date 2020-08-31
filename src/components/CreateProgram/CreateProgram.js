import React, { useState, useEffect } from "react";
import Exercise from "../Exercises/Exercise";
import fire from "../../API/Fire";

const CreateProgram = (props) => {
  const [programName, setProgramName] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [allExercises, setAllExercises] = useState({});
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [activeEx, setActiveEx] = useState({});
  const [activeMet, setActiveMet] = useState([]);
  const [activePos, setActivePos] = useState([]);
  const [showExDetails, setShowExDetails] = useState(false);
  const [methodIndex, setMethodIndex] = useState();
  const [positionIndex, setPositionIndex] = useState();
  const [programEx, setProgramEx] = useState([]);

  const handleAddExercise = () => {
    console.log("Handle Adding Exercise");
    fire.getExercises().then((data) => setAllExercises(data.val()));
    setShowAllExercises(true);
  };

  const handleSelectExercise = (e, exName) => {
    const selected =
      allExercises[
        Object.keys(allExercises).filter((exercise) => exercise === exName)
      ];
    setActiveEx(selected.name);
    setActiveMet((activeMet) => [...activeMet, selected.methods]);
    setActivePos((activePos) => [...activePos, selected.positions]);
    setShowAllExercises(false);
    setShowExDetails(true);
  };

  const handleSelectExDetails = (e, i) => {
    e.target.id === "method" ? setMethodIndex(i) : setPositionIndex(i);
  };

  const handleUpdateExercise = () => {
    console.log("Handle Update Exercises");
    setProgramEx((programEx) => [
      ...programEx,
      {
        id: programEx.length,
        key: programEx.length,
        name: activeEx,
        methods: activeMet[0][methodIndex],
        positions: activePos[0][positionIndex],
        sets: 0,
        reps: 0,
      },
    ]);
    setMethodIndex(null);
    setPositionIndex(null);
    setShowExDetails(false);
  };

  const HandleSetRepChange = (e, id) => {
    console.log(e.target.value);
    let cpyProgramEx = [...programEx];
    e.target.id === "sets"
      ? (cpyProgramEx[id].sets = e.target.value)
      : (cpyProgramEx[id].reps = e.target.value);
    setProgramEx(cpyProgramEx);
  };

  const handlePublish = async () => {
    console.log("Handle Publish Program");
    const pKey = await fire.publishProgram(programName, programDesc, programEx);

    pKey !== null
      ? props.history.push("/programs/" + pKey)
      : console.log("Error");
  };

  return (
    <div className="createprogram-background">
      {console.log(programEx)}
      <div className="createprogram-container">
        <div className="createprogram-heading">
          <input
            type="text"
            placeholder="Enter Program name"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            name="program_name"
          />
        </div>
        <div className="createprogram-description">
          <input
            type="text"
            placeholder="Enter Program description..."
            value={programDesc}
            onChange={(e) => setProgramDesc(e.target.value)}
            name="program_description"
          />
        </div>
        <div className="createprogram-type">STRENGTH</div>
        <div className="createprogram-exercises">
          <div className="createprogram-table">
            <div className="cp-tableheader">
              <div className="cp-tableheader-exercise">Exercises</div>
              <div className="cp-tableheader-reps">Sets</div>
              <div className="cp-tableheader-sets">Reps</div>
            </div>
            <div className="cp-tablebody">
              <button name="showExercises" onClick={() => handleAddExercise()}>
                Add
              </button>

              {programEx.map((exercise) => {
                // need delete button for exercises
                return (
                  <div key={exercise.key} id={exercise.key}>
                    <div className="cp-tablebody-exercise">
                      {exercise.name}
                      <br />
                      M: {exercise.methods}, P: {exercise.positions}
                    </div>
                    <div className="cp-tablebody-sets">
                      <input
                        value={exercise.sets}
                        onChange={(e) => HandleSetRepChange(e, exercise.id)}
                        name={exercise.key}
                        className="sets"
                        id="sets"
                      />
                    </div>
                    <div className="cp-tablebody-reps">
                      <input
                        value={exercise.reps}
                        onChange={(e) => HandleSetRepChange(e, exercise.id)}
                        name={exercise.key}
                        className="reps"
                        id="reps"
                      />
                    </div>
                  </div>
                );
              })}
              {showAllExercises &&
                Object.keys(allExercises).map((exName) => {
                  return (
                    <button
                      className="cp-tablebody-exercise"
                      key={allExercises[exName].id}
                      onClick={(e) => handleSelectExercise(e, exName)}
                    >
                      {allExercises[exName].name}
                    </button>
                  );
                })}
              {showExDetails && (
                <div className="showExercisesFlagsContainer">
                  <div className="showExercisesFlagsContainer-recyclerview">
                    <h2 className="fc-heading">{activeEx}</h2>
                    <h4>Method:</h4>
                    <div className="fc-exercise-methods">
                      {activeMet[0].map((method, i) => {
                        return (
                          <button
                            id="method"
                            className={
                              methodIndex === i
                                ? "fc-method-container active"
                                : "fc-method-container"
                            }
                            key={i}
                            onClick={(e) => handleSelectExDetails(e, i)}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                    <h4>Positions:</h4>
                    <div className="fc-exercise-methods">
                      {activePos[0].map((position, i) => {
                        return (
                          <button
                            id="position"
                            className={
                              positionIndex === i
                                ? "fc-method-container active"
                                : "fc-method-container"
                            }
                            key={i}
                            onClick={(e) => handleSelectExDetails(e, i)}
                          >
                            {position}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={() => handleUpdateExercise()}>Add</button>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => handlePublish()}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
