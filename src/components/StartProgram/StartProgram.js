import React, { useState, useEffect, Children } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import fire from "../../API/Fire";

const StartProgram = (props) => {
  const [start, setStart] = useState(false);
  const [program, setProgram] = useState({});
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [currSet, setCurrSet] = useState(0);
  const [currEx, setCurrEx] = useState(0);
  const [fraction, setFraction] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [completeProgram, setCompleteProgram] = useState(false);

  useEffect(() => {
    let counter = 0;
    fire
      .getProgram(props.match.params.id)
      .then((data) => {
        setProgram(data.val());
        data.val().exercises.map(e => counter += Number.parseInt(e.sets));
        setTotal(counter);
      });

    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setSeconds(seconds + 1), 1000);
      if (seconds === 60) {
        setSeconds(0);
        setMinutes(minutes + 1);
      }
    }

    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  const handleWeightInput = (e) => {
    console.log(e.target.value);
  };

  const handleCompleteSet = (totalSets) => {
    console.log(`Total sets: ${totalSets}, ${currSet}`);
    if (totalSets - 1 == currSet) {
      setCurrEx(currEx + 1);
      setCurrSet(0);
    } else {
      setCurrSet(currSet + 1);
    }
    setFraction(fraction + 1);
    setPercentage((((fraction + 1)/total)*100).toFixed(0));
    console.log(percentage);
  };

  const handleCompleteProgram = (e) => {
    // update firebase with status: true
    // navigate back to Routine

    //   doneProgram = (e) => {
//     // Use program key to update firebase database
//     let database = fire.database();
//     let uid = fire.auth().currentUser.uid;
//     // var newPostKey = database.ref().child('programs').push().key;
//     let newStartTime = this.state.startTime;
//     let newEndTime = new Date().toISOString();
//     console.log(newEndTime);
//     this.setState({
//       endTime: newEndTime,
//     });
//     database
//       .ref("users/" + uid + "/routine/" + this.state.program_key + "/")
//       .update({
//         isdone: true,
//         start: newStartTime,
//         end: newEndTime,
//       });
//     alert("Program Complete!");
//     // at end - navigate back to routine page
//     this.props.history.push("/routine");
//   };
  };

  return (
    <div className="programContainer-background">
      {start ? (
        <div className="start-program-container">
          <div className="SP-static-heading">
            <div className="SP-heading-top">
              <h2>{program.name}</h2>
              <div className="SP-timer">
                {minutes}:{seconds}
              </div>
              <div className="progressbar-container">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  background
                  backgroundPadding={6}
                  circleRatio={0.75}
                  strokeWidth={8}
                  styles={buildStyles({
                    rotation: 1 / 2 + 1 / 8,
                    backgroundColor: "#2cd1ff",
                    textColor: "#282c34",
                    pathColor: "#282c34",
                    trailColor: "rgba(255, 255, 255, 0.7)",
                  })}
                />
              </div>
            </div>
            <div className="SP-button-container">
              <button
                className="SP-cancel-button"
                onClick={() => setStart(false)}
              >
                Cancel
              </button>
              <button
                className="handle-timer-button"
                id="on"
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? "Pause Timer" : "Start Timer"}
              </button>
              <button
                onClick={(e) => handleCompleteProgram(e)}
                className={
                  percentage == 100
                    ? "SP-done-button"
                    : "SP-done-button disabledBtn"
                }
                disabled={percentage != 100 ? true : false}
              >
                Done
              </button>
            </div>
            {program.exercises.map((exercise, index) => {
              return (
                <div className="sp-overlay">
                  <div className="SP-exercise-headings">
                    <h1>{exercise.name}</h1>
                    <h5>{exercise.methods}</h5>
                    <h5>{exercise.positions}</h5>
                  </div>
                  <div id="SP-sets" className="SP-row-container">
                    <h4 className="SP-exercise-sets"></h4>
                    {Array.from(
                      Array(Number.parseInt(exercise.sets)),
                      (e, i) => {
                        return (
                          <h4 key={i} id={i} className="SP-exercise-sets">
                            Set {i + 1}
                          </h4>
                        );
                      }
                    )}
                  </div>
                  <div id="SP-sets" className="SP-row-container">
                    <h4 className="SP-exercise-sets">Reps</h4>
                    {Array.from(
                      Array(Number.parseInt(exercise.sets)),
                      (e, i) => {
                        return (
                          <h4 key={i} id={i} className="SP-exercise-sets">
                            {exercise.reps}
                          </h4>
                        );
                      }
                    )}
                  </div>
                  <div id="SP-sets" className="SP-row-container">
                    <h4 className="SP-exercise-sets">Status</h4>
                    {Array.from(
                      Array(Number.parseInt(exercise.sets)),
                      (e, i) => {
                        return (
                          <div key={i} id={i} className="SP-exercise-sets">
                            {index < currEx ||
                            (index === currEx && i < currSet) ? (
                              <i className="material-icons">done</i>
                            ) : i === currSet && index === currEx ? (
                              <button
                                className="complete-set-button"
                                id={"sp-status-" + index + "-" + i}
                                onClick={() => handleCompleteSet(exercise.sets)}
                              >
                                <i
                                  className="material-icons"
                                  id={"sp-status-" + index + "-" + i}
                                >
                                  play_arrow
                                </i>
                              </button>
                            ) : (
                              <h5>-</h5>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setStart(true)}>PRESS TO START</button>
        </div>
      )}
    </div>
  );
};

export default StartProgram;
