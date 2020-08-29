import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Exercise extends Component {

    render() {
        // console.log(this.props);
        if (this.props.createProgram){
            return (
                <div className='exercise-container' name={this.props.exerciseId} id={this.props.exerciseId} exercise={this.props.exerciseName} methods={this.props.exerciseMethods} positions={this.props.exercisePositions}>
                    <p>{this.props.exerciseName}</p>
                </div>
            )
        } else {
            return (
                <Link to={'exercises/' + this.props.exerciseName + '/' + this.props.exerciseId} exercise={this.props.exerciseName}><div className='exercise-container'>
                    <p>{this.props.exerciseName}</p>
                </div></Link>
            )
        }
            
        
    }
}

export default Exercise
