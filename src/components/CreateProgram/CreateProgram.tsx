import React, { useState, useEffect } from "react";
import { History } from 'history';
// import Exercise from "../Exercises/Exercise";
import fire from "../../API/Fire";

interface Props {
  history: History;
}

interface SelectedExercise {
  name: string;
  description: string;
  id: string;
  type: string;
  methods: [];
  positions: string;
}

interface ProgramExercise {
  id: string;
  key: string;
  name: string;
  methods: string;
  positions: string;
  sets: number;
  reps: number;
}

const CreateProgram: React.FC<Props> = (props) => {
  const [programName, setProgramName] = useState<string>("");
  const [programDesc, setProgramDesc] = useState<string>("");
  const [allExercises, setAllExercises] = useState<any>({});
  const [showAllExercises, setShowAllExercises] = useState<boolean>(false);
  const [activeEx, setActiveEx] = useState<any>({});
  const [activeMet, setActiveMet] = useState<any>([]);
  const [activePos, setActivePos] = useState<any>([]);
  const [showExDetails, setShowExDetails] = useState<boolean>(false);
  const [methodIndex, setMethodIndex] = useState<number>(0);
  const [positionIndex, setPositionIndex] = useState<number>(0);
  const [programEx, setProgramEx] = useState<any>([]);

  const handleAddExercise = () => {
    console.log("Handle Adding Exercise");
    fire.getExercises().then((data) => setAllExercises(data.val()));
    setShowAllExercises(true);
  };

  const handleSelectExercise = (exName: string) => {
    // const selected: any =
    //   allExercises[
    //     Object.keys(allExercises).filter((exercise: any) => exercise === exName)
    //   ];
    const selected: SelectedExercise = allExercises[exName];
    setActiveEx(selected.name);
    setActiveMet((activeMet: []) => [...activeMet, selected.methods]);
    setActivePos((activePos: []) => [...activePos, selected.positions]);
    setShowAllExercises(false);
    setShowExDetails(true);
  };

  const handleSelectExDetails = (e: React.MouseEvent<HTMLElement>, i: number) => {
    (e.target as HTMLElement).id === "method" ? setMethodIndex(i) : setPositionIndex(i);
  };

  const handleUpdateExercise = () => {
    console.log("Handle Update Exercises");
    setProgramEx((programEx: []) => [
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
    setMethodIndex(0);
    setPositionIndex(0);
    setShowExDetails(false);
  };

  const HandleSetRepChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    let cpyProgramEx = [...programEx];
    (e.target as HTMLElement).id === "sets"
      ? (cpyProgramEx[Number.parseInt(id)].sets = (e.target as HTMLInputElement).value)
      : (cpyProgramEx[Number.parseInt(id)].reps = (e.target as HTMLInputElement).value);
    setProgramEx(cpyProgramEx);
  };

  const handlePublish = async () => {
    console.log("Handle Publish Program");
    const pKey = await fire.publishProgram(programName, programDesc, programEx);

    if(pKey === null) return null;
    props.history.push("/programs/" + pKey);
    // pKey !== null
    //   ? props.history.push("/programs/" + pKey)
    //   : console.log("Error");
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

              {programEx.map((exercise: ProgramExercise) => {
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
                      onClick={() => handleSelectExercise(exName)}
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
                      {activeMet[0].map((method: string, i: number) => {
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
                      {activePos[0].map((position: string, i: number) => {
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
