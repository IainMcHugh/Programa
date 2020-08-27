import React, { Component } from 'react';
import fire from './Fire';
import { Link } from 'react-router-dom';

class Programs extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             search: '',
             programHolder: []
        }
    }

    componentDidMount(){
        let prevPrograms = this.state.programHolder;
        let database = fire.database();
        database.ref('/programs/').orderByChild('timestamp').once('value').then((snap) => {
            snap.forEach((item) => {
                console.log(item.key);
                var temp = {
                    key: item.key,
                    name: item.val().name
                }
                prevPrograms.push(temp);
            });
            this.setState({
                programHolder: prevPrograms
            });
        });
    }
    
    searchUpdate = (e) => {
        this.setState({
            search: e.target.value
        });
    }

    render() {
        const { programHolder } = this.state;
        
        return (
            <div className='programs-container'>
               <h2>Find Programs for you...</h2>
               <div className='programs-searchbar'>
                    <input type='text' value={this.state.search} onChange={this.searchUpdate} name='search' placeholder='Search'/>
                </div>
                <div className='recyclers-container'>
                    <h4>Trending</h4>
                    <div className='horizontal-container'></div>
                    <h4>Recently Added</h4>
                    <div className='programs-horizontal-container'>
                        {
                            programHolder.map((program) => {
                                return(
                                <Link className='program-container-link' to={'programs/' + program.key} key={program.key}>
                                <div className='program-container' key={program.key}>
                                    <h2>{program.name}</h2>
                                </div>
                            </Link>
                            )})
                        }
                    </div>
                    <h4>Stretching Specific</h4>
                    <div className='horizontal-container'></div>
                </div>
            </div>
        )
    }
}

export default Programs