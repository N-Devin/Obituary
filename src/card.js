import React, { useState, useEffect, useRef } from "react";

function Card({
  dead_pic,
  name,
  birthDate,
  deathDate,
  Obituary,
  image_url,
  mp3_url,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(mp3_url);
  }, [mp3_url]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  return (
    <div className="card">
      <div className="card-pic-container">
        <img src={image_url} alt="card image" className="card-image" />
      </div>
      <div className="card-body">
        <p className="card-title">{name}</p>
        <p className="card-text">
          {birthDate} - {deathDate}
        </p>
        <div className="card-hide">
          <p className="card-description">{Obituary}</p>
          <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
