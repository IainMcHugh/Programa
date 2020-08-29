import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import fire from '../../API/Fire';

export class StartProgram extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            program_id: this.props.match.params.id,
            program_key: this.props.match.params.eventkey,
            program_name: '',
            program_exercises: [],
            isStartedProgram: false,
            programTimer: 0,
            timerOn: true,
            startTime: 0,
            endTime: 0,
            startProgram_exercises: [],
            SPExercises: [],
            SPExercises2: [],
            activeExercise: 0,
            activeRow: 0,
            activeRows: [],
            completeExercises: [],
            exerciseKEYArray: [],
            exerciseSetsArray: [],
            exerciseRepsArray: [],
            percentage: 0,
            totalLines: 0,
            linesComplete: 0,
            buttonProgress: 0,
        }
    }

    componentDidMount() {
        let newStartTime = new Date().toISOString();
        console.log(newStartTime);
        this.setState({
            startTime: newStartTime,
        });
        fire.auth().onAuthStateChanged( user => {
            if (user) {
                let uid = user.uid;
                let database = fire.database();
                let getSavedPrograms = this.state.savedPrograms;
                let prevTotalLines = this.state.totalLines;
                let rowsArray = new Array();
                let completeArray = new Array();
                database.ref('programs/' + this.state.program_id).once('value').then((snap) => {
                    this.setState({
                        program_name: snap.val().name,
                        program_exercises: snap.val().exercises,
                        startProgram_exercises: snap.val().exercises
                    });
                    this.state.startProgram_exercises.forEach((exercise, index)=>{
                        let exerciseArray = new Array();
                        let repsArray = new Array();
                        let weightsArray = new Array();
                        let statusArray = new Array();
                        rowsArray.push(0);
                        completeArray.push(false);
                        for(let n=0;n<exercise.sets;n++){
                            repsArray.push(exercise.sets);
                            weightsArray.push(0);
                            statusArray.push(false);
                        }
                        exerciseArray.push(repsArray, weightsArray, statusArray);
                        // console.log(exerciseArray);
                        this.state.SPExercises2.push(exerciseArray);
                        // console.log(this.state.SPExercises2);
                        this.setState({
                            activeRows: rowsArray,
                        })
                    });
                    
                    
                    prevTotalLines = this.state.SPExercises2.length;
                    this.setState({
                        totalLines: prevTotalLines,
                    })

                    if(snap.val().author == uid){
                        console.log("THIS IS THE USERS PROGRAM")
                        this.setState({
                            isUsersProgram: true
                        })
                    }
                });
            }
        });
    }

    pressToStart = () => {
        this.setState({
            isStartedProgram: true
        })
        this.startTimer();
    }

    startTimer = ()=> {
        var _this = this;
        this.incrementer = setInterval(()=>{
            _this.setState({
                programTimer: (_this.state.programTimer + 1)
            })
        }, 1000);
    }

    getSeconds = () => {
        return('0'+this.state.programTimer % 60).slice(-2);
    }

    getMinutes = () => {
        return(Math.floor(this.state.programTimer / 60));
    }

    handleStopTimer = (e) => {
        if (e.target.id == 'on'){
            clearInterval(this.incrementer);
            this.setState({
                timerOn: false,
            })
            document.getElementsByClassName('handle-timer-button')[0].setAttribute('id', 'off');
        } else {
            var _this = this;
            this.incrementer = setInterval(()=>{
                _this.setState({
                    programTimer: (_this.state.programTimer + 1)
                })
            }, 1000);
            this.setState({
                timerOn: true,
            })
            document.getElementsByClassName('handle-timer-button')[0].setAttribute('id', 'on');
        }
        
    }

    SPCancelButton = (event) => {
        this.setState({
            isStartedProgram:false,
            programTimer: 0,
            timerOn: false,
        });
        clearInterval(this.incrementer);
    }

    weightUpdater = (e) => {
        // console.log(e.target.value);
        // console.log(e.target.id);
        let activeExerciseId = parseInt(e.target.id);
        let prevRows = this.state.activeRows;
        const currActiveExercise = this.state.activeExercise;
        const currActiveRow = this.state.activeRow;
        let prevSPExercise2 = this.state.SPExercises2;
        if(e.target.value == ""){
            // prevSPExercise2[currActiveExercise][1][currActiveRow] = 0;
            prevSPExercise2[currActiveExercise][1][prevRows[activeExerciseId]] = 0;
        } else {
            // prevSPExercise2[activeExerciseId][1][currActiveRow] = e.target.value;
            prevSPExercise2[activeExerciseId][1][prevRows[activeExerciseId]] = e.target.value;
        }
        this.setState({
            SPExercises2: prevSPExercise2
        })
    }

    completeSet = (e) => {
        console.log(e.target.id);
        const activeBlock = e.target.id;
            
        const splitId = activeBlock.split("-");
        const activeExerciseId = parseInt(splitId[2]);
        const activeRowId = parseInt(splitId[3]);
        // console.log("1: " + activeExerciseId + " + "  + activeRowId);
        const currActiveExercise = this.state.activeExercise;
        let prevSPExercise2 = this.state.SPExercises2;
        let prevRow = this.state.activeRow;
        let prevRows = this.state.activeRows;
        let prevCompleteExercises = this.state.completeExercises;
        // console.log("2: " + currActiveExercise + " + " + prevRow);
        // prevSPExercise2[currActiveExercise][2][prevRow] = true;
        prevSPExercise2[activeExerciseId][2][activeRowId] = true;
        let newRow = prevRow + 1;
        prevRows[activeExerciseId] = prevRows[activeExerciseId] + 1;
        this.setState({
            activeRow: newRow,
            activeRows: prevRows,
            SPExercises2: prevSPExercise2,
        });
        // Check if this exercise is complete
        if (prevRows[activeExerciseId] == prevSPExercise2[activeExerciseId][0].length){
            console.log("This exercise is complete!");
            // update Percentage
            let prevTotalLines = this.state.totalLines;
            let prevLinesComplete = this.state.linesComplete;
            prevLinesComplete++;

            const newPercentage = (prevLinesComplete / prevTotalLines) * 100;

            prevCompleteExercises[activeExerciseId] = true;
            this.setState({
                completeExercises: prevCompleteExercises,
                linesComplete: prevLinesComplete,
                percentage: newPercentage,
            })
        }
       
    }

    doneProgram = (e) => {
        // Use program key to update firebase database
        let database = fire.database();
        let uid = fire.auth().currentUser.uid;
        // var newPostKey = database.ref().child('programs').push().key;
        let newStartTime = this.state.startTime;
        let newEndTime = new Date().toISOString();
        console.log(newEndTime)
        this.setState({
            endTime: newEndTime,
        });
        database.ref('users/' + uid + '/routine/' + this.state.program_key + '/').update({
            isdone: true,
            start: newStartTime,
            end: newEndTime,
        });
        alert("Program Complete!");
        // at end - navigate back to routine page
        this.props.history.push('/routine');
    }

    render() {
        const { program_name, isStartedProgram, SPExercises2, activeExercise, activeRow, activeRows, completeExercises, startProgram_exercises, timerOn, percentage, buttonProgress } = this.state;
        return (
            <div className='programContainer-background'>
                    {
                        isStartedProgram ?
                        <div className='start-program-container'>
                            <div className='SP-static-heading'>
                                <div className='SP-heading-top'>
                                    <h2>{program_name}</h2>
                                    <div className='SP-timer'>{this.getMinutes()}:{this.getSeconds()}</div>
                                    <div className='progressbar-container'>
                                        <CircularProgressbar
                                        value={percentage}
                                        text={`${Math.round(percentage)}%`}
                                        background
                                        backgroundPadding={6}
                                        circleRatio={0.75}
                                        strokeWidth={8}
                                        styles={buildStyles({
                                            rotation: 1 / 2 + 1 / 8,
                                            backgroundColor: "#2cd1ff",
                                            textColor: "#282c34",
                                            pathColor: "#282c34",
                                            trailColor: "rgba(255, 255, 255, 0.7)"
                                        })}
                                        />
                                    </div>
                                </div>
                                <div className='SP-button-container'>
                                        <button className='SP-cancel-button' onClick={this.SPCancelButton}>Cancel</button>
                                        <button className='handle-timer-button' id='on' onClick={this.handleStopTimer}>{timerOn ? "Pause Timer" : "Start Timer"}</button>
                                        <button onClick={this.doneProgram} className={percentage==100 ? 'SP-done-button' : 'SP-done-button disabledBtn'} disabled={percentage!=100 ? true : false}>Done</button>
                                </div>
                            </div>
                            {
                            startProgram_exercises.map((SPexercise, index1) => {
                                return(
                                <div key={index1} id={'SP-exercise-'+index1} className='SP-overlay'>
                                    <div className='SP-exercise-headings'>
                                        <h1>{SPexercise.name}</h1>
                                        <h5>{SPexercise.positions}</h5>
                                        <h5>{SPexercise.methods}</h5>
                                    </div>
                                    <div id='SP-sets' className='SP-row-container'>
                                        <h4 className='SP-exercise-sets'></h4>
                                        {
                                            Array.from(Array(SPExercises2[index1][0].length), (e, i) => {
                                                return <h4 key={i} id={i} className='SP-exercise-sets'>Set {i+1}</h4>
                                            })
                                        }
                                    </div>
                                    {
                                    Array.from(Array(SPExercises2[index1].length), (e1, i) => {
                                        return(
                                            <div className='SP-row-container' key={i}>
                                                <h4 className='SP-exercise-sets'>{
                                                i==0 ?
                                                "Reps":
                                                i ==1 ?
                                                "Weight":
                                                "Status"
                                                }</h4>
                                                {
                                                    Array.from(Array(SPExercises2[index1][0].length), (e2, j) => {
                                                        return(
                                                        <h4
                                                        key={j}
                                                        id={i === 0 ?
                                                            "sp-rep-" + j :
                                                            i === 1 ?
                                                            "sp-weight-" + j :
                                                            "sp-status-" + index1 + "-" + j
                                                            }
                                                        className='SP-exercise-sets'>
                                                            {
                                                            typeof(SPExercises2[index1][i][j]) !== "boolean" ?
                                                            SPExercises2[index1][i][j] :
                                                            SPExercises2[index1][i][j] === true ?
                                                            <i className='material-icons'>done</i> :
                                                            // j === activeRow ?
                                                            j === activeRows[index1] ?
                                                            <button
                                                            className='complete-set-button'
                                                            id={i === 0 ?
                                                                "sp-rep-" + j :
                                                                i === 1 ?
                                                                "sp-weight-" + j :
                                                                "sp-status-" + index1 + "-" + j
                                                                }
                                                                onClick={this.completeSet}
                                                            // onMouseDown={this.completeSet}
                                                            // onMouseUp={this.handleButtonRelease}
                                                            ><i 
                                                            className='material-icons'
                                                            id={i === 0 ?
                                                                "sp-rep-" + j :
                                                                i === 1 ?
                                                                "sp-weight-" + j :
                                                                "sp-status-" + index1 + "-" + j
                                                                }>play_arrow</i></button>
                                                            :
                                                            "-"
                                                            }
                                                        </h4>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                    }
                                    {completeExercises[index1] ?
                                        <div>Complete!</div>
                                    :
                                    <div className='weight-scale'>
                                        <input className='weight-scale-input' placeholder='Enter Weight [KG]' onChange={this.weightUpdater} name='weightInput' id={index1}/>
                                    </div>}
                                </div>)
                            })
                            }
                            </div>
                        :
                        <div>
                            <button onClick={this.pressToStart}>PRESS TO START</button>
                        </div>
                    }

            </div>
        )
    }
}

export default StartProgram
