import React, { useState, useEffect } from "react";
import fire from "../../API/Fire";
import { Link } from "react-router-dom";
import defaultProfile from "../../images/profileLogo.png";

interface Programs {
  username: string;
  email: string;
  programs: { [key: string]: string; };
  routine: {};
}

const Profile: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [programs, setPrograms] = useState<any>({});
  const [savedPrograms, setSavedPrograms] = useState<any>({});

  useEffect(() => {
    // get username + email
    fire.getUserData()
    .then((data) => {
      setEmail(data.val().email);
      setUsername(data.val().username);
      setPrograms(data.val().programs);
      setSavedPrograms(data.val().saved_programs);
    }).catch((err) => console.log(err));
  }, []);

  const logout = () => {
    fire.logout();
  };

  return (
    <div className="profile-container">
      <img className="profile-img" src={defaultProfile} alt="profile" />
      <div className="profile-table-container">
        <table className="profile-table">
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
      <div className="profile-programs-container">
        {programs &&
          Object.keys(programs).map(program => {
            return (
              <Link
                className="program-container-link"
                to={"programs/" + program}
                key={program}
              >
                <div className="program-container" key={program}>
                  <h2>{programs[program]}</h2>
                </div>
              </Link>
            );
          })}
        <Link className="create-program" to="/profile/createprogram">
          <button>Create Program</button>
        </Link>
      </div>
      <h2>Saved Programs</h2>
      <div className="profile-programs-container">
        {savedPrograms && Object.keys(savedPrograms).map(program => {
          return (
            <Link
              className="program-container-link"
              to={"programs/" + program}
              key={program}
            >
              <div className="program-container" key={program}>
                <h2>{savedPrograms[program]}</h2>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="profile-buttons-container">
        <Link to="/profile/editprofile">
          <button>Edit Profile</button>
        </Link>
        <button onClick={() => logout()}>Log out</button>
      </div>
    </div>
  );
};

export default Profile;
