import React, { Component } from 'react'
import Exercise from './Exercise';
import fire from './Fire';

class Exercises extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            search: '',
            exercises: []
        }
    }
    
    componentDidMount() {
        const getExercises = this.state.exercises;
        let database = fire.database();
        database.ref('exercises/').once('value').then((snap) => {
            snap.forEach((item) => {
                
                var temp = {name: item.val().name, id: item.val().id};
                getExercises.push(temp);
                this.setState({
                    exercises: getExercises,
                });
                
            });
        });
        
    }

    searchUpdate = (e) => {
        this.setState({
            search: e.target.value
        });
    }
    

    render() {
        const { exercises } = this.state;
        let filteredExercises = exercises.filter((exercise) => {
            console.log(exercise);
            return exercise.name.toLowerCase().startsWith(this.state.search.toLowerCase()) !== false;
        });

        return (
            <div className='exercises-container'>
                <div className='exercises-searchbar'>
                    <input type='text' value={this.state.search} onChange={this.searchUpdate} name='search' placeholder='Search'/>
                </div>
                <div className='exercises-recyclerview'>
                {
                    filteredExercises.map((exercise) => {
                        return(
                            <Exercise exerciseName={exercise.name} exerciseId={exercise.id} key={exercise.id}/>
                        )
                    })
                }
                </div>
            </div>
        )
        
    }
}

export default Exercises
