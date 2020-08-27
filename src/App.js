import React, { Component } from 'react';
import './App.css';
import fire from './components/Fire';
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       user: {}
    }
  }
  
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        console.log("There is a user");
        this.setState({
          user
        });
        localStorage.setItem('user', user.uid);
      } else {
        console.log("There is NOT a user");
        this.setState({
          user: null
        })
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.user ? (<Home />) : (<Login />)}
      </div>
    );  
  }
}

export default App;
