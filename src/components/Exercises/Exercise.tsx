import React, { Component } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    createProgram?: boolean;
    exerciseId: string;
    exerciseName: string;
}

const Exercise: React.FC<Props> = (props) => {
    if (props.createProgram) {
        return (
            <div className='exercise-container' id={props.exerciseId}>
                <p>{props.exerciseName}</p>
            </div>
        )
    } else {
        return (
            <Link
                to={'exercises/' + props.exerciseName + '/' + props.exerciseId}
            >
                <div className='exercise-container'>
                    <p>{props.exerciseName}</p>
                </div>
            </Link>
        )
    }


}

export default Exercise
