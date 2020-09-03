import React, { useState, useEffect, Children } from "react";
import { History } from "history";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import fire from "../../API/Fire";

interface Props {
  match: {
    params: { id: string; eventkey: string; }
  };
  history: History;
}

interface Exercises {
  key: number;
  id: string;
  name: string;
  methods: string;
  positions: string;
  sets: string;
  reps: string;
}

const StartProgram: React.FC<Props> = (props) => {
  const [start, setStart] = useState<boolean>(false);
  const [program, setProgram] = useState<any>({});
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [currSet, setCurrSet] = useState<number>(0);
  const [currEx, setCurrEx] = useState<number>(0);
  const [fraction, setFraction] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("");
  const [completeProgram, setCompleteProgram] = useState<boolean>(false);

  useEffect(() => {
    setStartTime(new Date().toISOString());
    console.log(props.match);
    let counter = 0;
    fire.getProgram(props.match.params.id).then((data) => {
      setProgram(data.val());
      data.val().exercises.map((e: Exercises) => (counter += Number.parseInt(e.sets)));
      setTotal(counter);
    });

    let interval: number | undefined;
    if (timerActive) {
      interval = window.setInterval(() => setSeconds(seconds + 1), 1000);
      if (seconds === 60) {
        setSeconds(0);
        setMinutes(minutes + 1);
      }
    }

    return () => window.clearInterval(interval);
  }, [timerActive, seconds]);

  const handleCompleteSet = (totalSets: string) => {
    console.log(`Total sets: ${totalSets}, ${currSet}`);
    if (Number.parseInt(totalSets) - 1 == currSet) {
      setCurrEx(currEx + 1);
      setCurrSet(0);
    } else {
      setCurrSet(currSet + 1);
    }
    setFraction(fraction + 1);
    setPercentage(Number.parseInt((((fraction + 1) / total) * 100).toFixed(0)));
    console.log(percentage);
  };

  const handleCompleteProgram = () => {
    let endTime = new Date().toISOString();
    fire
      .completeProgram(props.match.params.eventkey, startTime, endTime)
      .then((res) => {
        console.log(`Response: ${res}`);
        props.history.push("/routine");
      })
      .catch((err) => console.log(err));
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
                onClick={() => handleCompleteProgram()}
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
            {program.exercises.map((exercise: Exercises, index: number) => {
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
                      (e: string, i: number) => {
                        return (
                          <h4 key={i} className="SP-exercise-sets">
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
                      (e: string, i: number) => {
                        return (
                          <h4 key={i} className="SP-exercise-sets">
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
                      (e: string, i: number) => {
                        return (
                          <div key={i} className="SP-exercise-sets">
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
