import React, { useState, useEffect } from "react";
import Exercise from "./Exercise";
import fire from "../../API/Fire";

const Exercises = () => {
  const [search, setSearch] = useState<string>();
  const [exercises, setExercises] = useState<any>({});

  useEffect(()=> {
    fire.getExercises().then(data => setExercises(data.val()));
  },[])

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <div className="exercises-container">
      <div className="exercises-searchbar">
        <input
          type="text"
          value={search}
          onChange={(e) => searchHandler(e)}
          name="search"
          placeholder="Search"
        />
      </div>
      <div className="exercises-recyclerview">
        {exercises && Object.keys(exercises).map((exercise: string) => {
          return (
            <Exercise
              exerciseName={exercises[exercise].name}
              exerciseId={exercises[exercise].id}
              key={exercises[exercise].id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Exercises;
