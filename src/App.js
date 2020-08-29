import React, { useState, useEffect } from "react";
import Firebase from "./API/Fire";
import Auth from "./components/Auth/Auth";
import Home from "./components/Home/Home";

import "./App.css";

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = Firebase.onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    }
  },[]);

  return <div className="App">{user ? <Home /> : <Auth />}</div>;
};

export default App;
