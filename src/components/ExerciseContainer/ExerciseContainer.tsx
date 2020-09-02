import React, { useState, useEffect } from "react";
import fire from "../../API/Fire";

interface Props {
  match: {params: {name: string}}
}

const ExerciseContainer: React.FC<Props> = (props) => {
  const [exercise, setExercise] = useState<any>("");
  const [id, setId] = useState<number>();

  useEffect(() => {
    let name = props.match.params.name.toLowerCase().replace(/\s+/g, "_");
    console.log(name);
    fire.getExercise(name).then((data) => setExercise(data.val()));
  }, []);

  //     getIdFromVidUrl() {
  //         const embed = 'https://www.youtube.com/embed/';
  //         let vid_id = this.state.vid_url.substring(this.state.vid_url.lastIndexOf("v=")+2,this.state.vid_url.length);
  //         let vid_embed = embed.concat(vid_id);
  //         return vid_embed;
  //     }
  return (
    <div className="exercisedetail-background">
      {console.log(exercise)}
      <div className="exercisedetail-container">
        <div className="exercisedetail-heading">{exercise.name}</div>
        <div className="exercisedetail-description">{exercise.description}</div>
        <div className="exercisedetail-vid">
          {/* {vid_embed && (
            <iframe
              src={vid_embed}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )} */}
        </div>
        <div className="exercisedetail-stats">
          <table>
            <tbody>
              <tr>
                <td>Active Programs:</td>
                <td>{exercise.active_programs}</td>
              </tr>
              <tr>
                <td>Uses:</td>
                <td>{exercise.uses}</td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>{exercise.type}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseContainer;
