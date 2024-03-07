import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
} from "react-icons/fa";

function AudioPlayer({ audioSrc, displayImage }) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(1);

  const [playing, setPlaying] = useState(true);
  const [mute, setMute] = useState(false);

  const audioRef = useRef();

  //playing and pausing
  const togglePlaying = () => {
    setPlaying(!playing);
  };

  const handleDuration = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  //handling duration bar
  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setCurrentTime(0);
    setPlaying(false);
  };

  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  //changing volume
  const changeVolume = (e) => {
    setMute(e.target.value == 0);
    setVolume(e.target.value);

    audioRef.current.volume = e.target.value;
  };

  //toggling mute
  const toggleMute = () => {
    if (mute) {
      setMute(false);
    } else {
      setMute(true);
    }
  };

  //changing value of audio/volume according to mute value
  useEffect(() => {
    if (mute) {
      audioRef.current.volume = 0;
      // setVolume(0);
    } else {
      audioRef.current.volume = volume;
      setVolume(volume);
    }
  }, [mute]);

  return (
    <div className="custom-audio-player">
      <img className="audio-display-image" src={displayImage} />
      <audio ref={audioRef} src={audioSrc} />

      <div className="display-flex" style={{ width: "60%" }}>
        <p style={{ alignItems: "center", cursor: "pointer" }} onClick={togglePlaying}>
          {playing ? <FaPause /> : <FaPlay />}
        </p>
        <p>{formatTime(currentTime)}</p>
        <input
          step={0.01}
          max={duration}
          value={currentTime}
          className="audio-range"
          type="range"
          onChange={handleDuration}
          style={{ cursor: "pointer" }}
        />
        <p>-{formatTime(duration - currentTime)}</p>
      </div>

      <div className="display-flex">
        <p style={{ cursor: "pointer" }} onClick={toggleMute}>
          {mute || volume == 0 ? <FaVolumeMute /> : <FaVolumeDown />}
        </p>
        <input
          value={volume}
          max={1}
          min={0}
          step={"0.0001"}
          className="volume-range"
          type="range"
          onChange={changeVolume}
          style={{ cursor: "pointer" }}
        />
        <p>{<FaVolumeUp />}</p>
      </div>
    </div>
  );
}

export default AudioPlayer;
