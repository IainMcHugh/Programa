import React, { Component } from 'react';
import Exercise from '../Exercises/Exercise';
import fire from '../../API/Fire';
import { Link, Redirect } from 'react-router-dom';

class CreateProgram extends Component {

    constructor(props) {
        super(props)
        this.timeout= "0";
        this.state = {
             program_name: '',
             program_description: '',
             exerciseListShow: false,
             changeExerciseShow: "FIRST",
             exercises: [],
             addedExercises: [],
             sets: [],
             reps: [],
             deleteExercise: null,
             activeExerciseId: null,
             exerciseHolder: {sets: 1, reps: 1},
             exerciseMethods: [],
             exercisePositions: [],
             isChosenMethod: null,
             isChosenPosition: null,
             program_newKey: null,
             redirect: false
        }
    }

    componentDidMount() {

        const getExercises = this.state.exercises;
        let database = fire.database();
        database.ref('exercises/').once('value').then((snap) => {
            snap.forEach((item) => {
                console.log(item.val().methods);
                var temp = {name: item.val().name,
                    id: item.val().id,
                    methods: item.val().methods,
                    positions: item.val().positions};
                getExercises.push(temp);
                this.setState({
                    exercises: getExercises,
                });
                
            });
        });
    }

    componentDidUpdate(){
        // USE THIS TO 
        if(this.state.redirect){
            console.log(this.state.program_newKey);
            this.props.history.push('/programs/' + this.state.program_newKey);
        }
    }

    publishProgram = (e) => {
        let database = fire.database();
        let uid = fire.auth().currentUser.uid;
        var newPostKey = database.ref().child('programs').push().key;
        let newDate = Date.now();
        database.ref('programs/' + newPostKey).set({
            key: newPostKey,
            name: this.state.program_name,
            author: uid,
            description: this.state.program_description,
            uses: 0,
            rating: 0,
            reviews: 0,
            exercises: this.state.addedExercises,
            timestamp: newDate
        });
        var updates = {};
        
        updates['users/' + uid + '/programs/' + newPostKey] = this.state.program_name;
        database.ref().update(updates);
        // database.ref('users/' + fire.auth().currentUser.uid).set({
        //     programs: newPostKey,
            
        // });
        // when completed, should link to program page thats created
        this.setState({
            program_newKey: newPostKey,
            redirect: true
        })

        // <Link to={'/programs/' + newPostKey}>
    }

    
    searchUpdate = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    setsRepsUpdate = (e) => {
        //need to check that e.target.value is of type integer only (ie. only numbers allowed)
        if(e.target.getAttribute('class') === 'sets'){
            let activeExerciseKey = e.target.getAttribute('name');
            console.log("ACTIVE KEY IS " + activeExerciseKey);
            let prevExercises = this.state.addedExercises;
            prevExercises.forEach((addedExercise) => {
                console.log(addedExercise.key);
                if(addedExercise.key == activeExerciseKey){
                    addedExercise.sets = e.target.value;
                }
                this.setState({
                    addedExercises: prevExercises
                });
            });
        } else if(e.target.getAttribute('class') === 'reps'){
            let activeExerciseKey = e.target.getAttribute('name');
            console.log("ACTIVE KEY IS " + activeExerciseKey);
            let prevExercises = this.state.addedExercises;
            prevExercises.forEach((addedExercise) => {
                console.log(addedExercise.key);
                if(addedExercise.key == activeExerciseKey){
                    addedExercise.reps = e.target.value;
                }
                this.setState({
                    addedExercises: prevExercises
                });
            });
        }
    }

    handleButtonPress = (e) => {
        let savedTarget = e.currentTarget;
        this.timeout = setTimeout(() =>{
            console.log(savedTarget.getAttribute('id'));
            this.setState({
                deleteExercise: savedTarget.getAttribute('id')
            });
            }, 800);
        
        
        console.log("A TEST: "+this.state.deleteExercise);
        
        
    }

    handleButtonRelease = () => {
        clearTimeout(this.timeout);
    }

    popExercise = (e) => {
        console.log(this.state.deleteExercise);
        let prevAddedExercises = this.state.addedExercises;
        prevAddedExercises.splice(this.state.deleteExercise, 1);
        this.setState({
            addedExercises: prevAddedExercises,
            deleteExercise: null
        });
    }

    toggleExercises = (e) => {
        let currentExerciseListState = this.state.exerciseListShow
        let prevChangeExerciseShow = 2;
        this.setState({
            exerciseListShow: !currentExerciseListState,
            changeExerciseShow: prevChangeExerciseShow
        });
    }

    exerciseFlags = (e) => {
        let id = this.state.activeExerciseId;
        console.log(e.target);
        if(e.target.getAttribute('id')){
            id = e.target.getAttribute('id');
            console.log("ID IS: " + id);
        }
        let currentExerciseHolder = this.state.exerciseHolder;
        let currentExerciseMethods = this.state.exerciseMethods;
        let currentExercisePositions = this.state.exercisePositions;
        let currentExerciseListLength = this.state.addedExercises.length;
        console.log("LENGTH IS "+ currentExerciseListLength);
        
        let prevAddedExercises = this.state.addedExercises;
        if(e.target.getAttribute('id')){
            currentExerciseHolder.key = currentExerciseListLength;
            currentExerciseHolder.id = e.target.getAttribute('id');
            currentExerciseHolder.name = e.target.getAttribute('exercise');
            currentExerciseMethods = e.target.getAttribute('methods');
            let methodsArray = currentExerciseMethods.split(',')
            currentExercisePositions = e.target.getAttribute('positions');
            let positionsArray = currentExercisePositions.split(',')
            console.log(currentExerciseMethods);
            this.setState({
                // addedExercises: prevAddedExercises
                exerciseHolder: currentExerciseHolder,
                exerciseMethods: methodsArray,
                exercisePositions: positionsArray,
            });
        }

        let prevChangeExerciseShow = 3;
        this.setState({
            changeExerciseShow: prevChangeExerciseShow,
            activeExerciseId: id
        })
    }

    defaultScreen = (e) => {
        
        let currentExerciseHolder = this.state.exerciseHolder;
        let prevAddedExercises = this.state.addedExercises;

        if(e.target.getAttribute('id')){
            currentExerciseHolder.methods = this.state.isChosenMethod
            currentExerciseHolder.positions = this.state.isChosenPosition
            prevAddedExercises.push(currentExerciseHolder);
            this.setState({
                addedExercises: prevAddedExercises
            });
        }
        let currentExerciseListState = this.state.exerciseListShow;
        let prevChangeExerciseShow = 1;
        this.setState({
            exerciseListShow: !currentExerciseListState,
            changeExerciseShow: prevChangeExerciseShow,
            exerciseHolder: {sets: 1, reps: 1},
            isChosenMethod: null,
            isChosenPosition: null
        });
        console.log(prevAddedExercises);
    }

    setChosenMethod = (e) => {
        console.log(e.target.getAttribute('id'));
        this.setState({
            isChosenMethod: e.target.getAttribute('id')
        })
    }

    setChosenPosition = (e) => {
        console.log(e.target.getAttribute('id'));
        this.setState({
            isChosenPosition: e.target.getAttribute('id')
        })
    }

    render() {
        const { exerciseListShow, exercises, addedExercises, deleteExercise, activeExerciseId, exerciseHolder, exerciseMethods, exercisePositions, isChosenMethod, isChosenPosition } = this.state;
        // console.log(this.props);
        
        return (
            <div className='createprogram-background'>
                <div className='createprogram-container'>
                    <div className='createprogram-heading'>
                        <input type='text' placeholder='Enter Program name' value={this.state.program_name} onChange={this.searchUpdate} name='program_name'/>
                        
                    </div>
                    <div className='createprogram-description'>
                        <input type='text' placeholder='Enter Program description...' value={this.state.program_description} onChange={this.searchUpdate} name='program_description'/>
                    </div>
                    <div className='createprogram-type'>
                        STRENGTH
                    </div>
                    <div className='createprogram-exercises'>
                        <div className='createprogram-table'>
                            <div className='cp-tableheader'>
                                <div className='cp-tableheader-exercise'>Exercises</div>
                                <div className='cp-tableheader-sets'>Reps</div>
                                <div className='cp-tableheader-reps'>Sets</div>
                            </div>
                            <div className='cp-tablebody'>
                                <button name='showExercises' onClick={this.toggleExercises}>Add</button>
                                
                                {(()=>{
                                    
                                    switch(this.state.changeExerciseShow) {
                                        case 1:
                                            return(addedExercises.map((addedExercise) => {
                                                return(
                                                    <div key={addedExercise.key} id={addedExercise.key} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}>
                                                        <div className='cp-tablebody-exercise'>{addedExercise.name}<br/>M: {addedExercise.methods}, P: {addedExercise.positions}</div>
                                                        <div className='cp-tablebody-sets'>
                                                            <input value={addedExercise.sets} onChange={this.setsRepsUpdate} name={addedExercise.key} className='sets'/>
                                                        </div>
                                                        <div className='cp-tablebody-reps'>
                                                            <input value={addedExercise.reps} onChange={this.setsRepsUpdate} name={addedExercise.key} className='reps'/>
                                                        </div>
                                                    </div>
                                                )
                                            }));
                                        case 2:
                                            return(<div className='showExercisesContainer'>
                                            <div className='showExercisesContainer-recyclerview'>
                                            {
                                                exercises.map((exercise) => {
                                                    return(
                                                        // <div key={exercise.id} onClick={this.toggleExercises}>
                                                        <div key={exercise.id} onClick={this.exerciseFlags}>
                                                            <Exercise exerciseName={exercise.name} exerciseId={exercise.id} key={exercise.id} exerciseMethods={exercise.methods} exercisePositions={exercise.positions} createProgram={exerciseListShow} />
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div> ;
                                        </div>);
                                        case 3:
                                            return(
                                            <div className='showExercisesFlagsContainer'>
                                                <div className='showExercisesFlagsContainer-recyclerview'>
                                                    <h2 className='fc-heading'>{exerciseHolder.name}</h2>
                                                    <h4>Method:</h4>
                                                    <div className='fc-exercise-methods'>
                                                        
                                                    {
                                                       
                                                        exerciseMethods.map((method) => {
                                                            return(
                                                                <div key={method} id={method} className={isChosenMethod == method ? 'fc-method-container active' : 'fc-method-container'} onClick={this.setChosenMethod}>
                                                                {method}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                        
                                                    </div>
                                                    <h4>Position:</h4>
                                                    <div className='fc-exercise-methods'>
                                                        
                                                    {
                                                       
                                                        exercisePositions.map((position) => {
                                                            return(
                                                                <div key={position} id={position} className={isChosenPosition == position ? 'fc-method-container active' : 'fc-method-container'} onClick={this.setChosenPosition}>
                                                                {position}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                        
                                                    </div>
                                                    <button id={activeExerciseId} onClick={this.defaultScreen}>Add</button>
                                                </div>
                                            </div>);
                                    }
                                }
                                )()}
                            </div>
                        </div>
                        
                        <button onClick={this.publishProgram}>Publish</button>
                    </div>
                </div>
                { deleteExercise ? 
                    <div className='deleteExercise-container' id={deleteExercise}>
                        <button onClick={this.popExercise}>Delete this exercise</button>
                        <button onClick={()=>{this.setState({deleteExercise: null});}}>Cancel</button>
                    </div>        
                    :
                    <div></div>
                }
            </div>
        )
    }
}

export default CreateProgram