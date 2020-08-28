import React, { Component } from 'react';
import profile_img from '../images/profile.png';
import defaultProfile from "../images/profileLogo.png";
import { Link } from 'react-router-dom';
import fire from './Fire';

export class Profile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             programs: [],
             savedPrograms: [],
             username: '',
             email: ''
        }
    }
    
    componentDidMount(){
        const getPrograms = this.state.programs;
        const getSavedPrograms = this.state.savedPrograms;
        fire.auth().onAuthStateChanged( user => {
            if (user) {
                 let uid = user.uid;

                 // let uid = fire.auth().currentUser.uid;
                let database = fire.database();
                database.ref('/users/' + uid).once('value').then((snap) => {
                    console.log(snap.val().username);
                    this.setState({
                        username: snap.val().username,
                        email: snap.val().email
                    });
                });
                
                database.ref('/users/' + uid + '/programs/').once('value').then((snap) => {
                    snap.forEach((item) => {
                        console.log(item.key);
                        var temp = {
                            program_id: item.key,
                            program_name: item.val()
                        }
                        getPrograms.push(temp);
                        console.log(getPrograms);
                    });
                    this.setState({
                        programs: getPrograms
                    });
                });

                database.ref('/users/' + uid + '/saved_programs/').once('value').then((snap) => {
                    snap.forEach((item) => {
                        console.log(item.key);
                        var temp2 = {
                            program_id: item.key,
                            program_name: item.val()
                        }
                        getSavedPrograms.push(temp2);
                        console.log(getSavedPrograms);
                    });
                    this.setState({
                        savedPrograms: getSavedPrograms
                    });
                });
            }
        });
    }

    logout = (e) => {
        fire.auth().signOut();
    }

    render() {
        const { programs, savedPrograms, username, email } = this.state;
        return (
            <div className='profile-container'>
                <img className='profile-img' src={defaultProfile} alt='profile'/>
                <div className='profile-table-container'>
                    <table className='profile-table'>
                        <tbody>
                            <tr>
                                <th>Name:</th>
                                <td>{username}</td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>{email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Your Programs</h2>
                <div className='profile-programs-container'>
                    {/* Get users programs and display scrollable programs */}
                    {programs.map((program) => {
                        return(
                            <Link className='program-container-link' to={'programs/' + program.program_id} key={program.program_id}>
                                <div className='program-container' key={program.program_id}>
                                    <h2>{program.program_name}</h2>
                                </div>
                            </Link>
                        )}
                    )}
                    <Link className='create-program' to='/profile/createprogram'><button>Create Program</button></Link>
                </div>
                <h2>Saved Programs</h2>
                <div className='profile-programs-container'>
                    {/* Get users saved programs and display scrollable programs */}
                    {savedPrograms.map((program) => {
                        return(
                            <Link className='program-container-link' to={'programs/' + program.program_id} key={program.program_id}>
                                <div className='program-container' key={program.program_id}>
                                    <h2>{program.program_name}</h2>
                                </div>
                            </Link>
                        )}
                    )}
                </div>

                <div className='profile-buttons-container'>
                    <Link to='/profile/editprofile'><button>Edit Profile</button></Link>
                    <button onClick={this.logout}>Log out</button>
                </div>
            </div>
        )
    }
}

export default Profile
