import React, { useEffect, useState } from "react";
import fire from "../../API/Fire";
import { Link } from "react-router-dom";

const Programs = () => {
  const [search, setSearch] = useState("");
  const [recents, setRecents] = useState({});
  const [trending, setTrending] = useState({});

  useEffect(() => {
    // Recently Added
    fire.getRecentlyAddedPrograms().then(data => setRecents(data.val()));
    // Trending
    fire.getTrendingPrograms().then(data => setTrending(data.val()));
  }, []);

  return (
    <div className="programs-container">
      <h2>Find Programs for you...</h2>
      <div className="programs-searchbar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          name="search"
          placeholder="Search"
        />
      </div>
      <div className="recyclers-container">
        <h4>Trending</h4>
        <div className="programs-horizontal-container">
        {trending &&
            Object.keys(trending).map((program) => {
              return (
                <Link
                  className="program-container-link"
                  to={"programs/" + program}
                  key={program}
                >
                  <div className="program-container" key={program}>
                    <h2>{trending[program].name}</h2>
                  </div>
                </Link>
              );
            })}
        </div>
        <h4>Recently Added</h4>
        <div className="programs-horizontal-container">
          {recents &&
            Object.keys(recents).map((program) => {
              return (
                <Link
                  className="program-container-link"
                  to={"programs/" + program}
                  key={program}
                >
                  <div className="program-container" key={program}>
                    <h2>{recents[program].name}</h2>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Programs;
