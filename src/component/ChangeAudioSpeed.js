<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function ChangeAudioSpeed({ onClose }) {
  const [audioFile, setAudioFile] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    setAudioFile(acceptedFiles[0]);
    setErrorMessage("");
  };

  const handleDropRejected = () => {
    setErrorMessage("Invalid file type. Please select an audio file.");
  };

  const applySpeedChange = async () => {
    if (!audioFile) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("speed", speed);

    try {
      const response = await axios.post(
        "http://localhost:8080/change-speed",
        formData,
        {
          responseType: "blob",
        }
      );

      const adjustedAudioUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      setDownloadUrl(adjustedAudioUrl);
    } catch (error) {
      console.error("Error applying speed change:", error);
      alert("Failed to process audio.");
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "audio/*": [".mp3", ".wav", ".ogg"],
      },
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div className="tool-container">
      <h2>Change Audio Speed</h2>

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#e0e0e0" : "#f9f9f9",
          borderColor: isDragReject ? "red" : "#ccc",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop an audio file here, or click to select a file</p>
        )}
      </div>

      {audioFile && (
        <>
          <label>
            Speed:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
          </label>
          <p>Selected Speed: {speed}x</p>
          <button onClick={applySpeedChange}>Apply Speed Change</button>
        </>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {downloadUrl && (
        <div>
          <h3>Adjusted Audio:</h3>
          <audio controls src={downloadUrl}></audio>
          <br />
          <a href={downloadUrl} download="adjusted-audio.mp3">
            Download Adjusted Audio
          </a>
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ChangeAudioSpeed;
=======
// src/component/ChangeAudioSpeed.js
import React, { useState } from 'react';

function ChangeAudioSpeed({ onClose }) {
  const [audioFile, setAudioFile] = useState(null);
  const [speed, setSpeed] = useState(1); // 1 is normal speed

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const applySpeedChange = () => {
    // Simulate applying speed change
    console.log(`Applying speed change to ${audioFile.name} with speed: ${speed}`);
  };

  return (
    <div className="tool-container">
      <h2>Change Audio Speed</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioFile && (
        <>
          <label>
            Speed:
            <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={handleSpeedChange} />
          </label>
          <button onClick={applySpeedChange}>Apply Speed Change</button>
        </>
      )}
      <button onClick={onClose}>Close</button>
      <ul className='data'>
          <li>
            <h2 className='heading'>How to speed up a song?</h2>
          </li>
          <li>
            <h3>Choose FIle</h3>
            <p>Select any file into the Audio Speed Changer window, or open files from URL, Dropbox and Google Drive folders.</p>
          </li>
          <li>
            <h3>Edit your audio</h3>
            <p>Use a slider to adjust the speed of your audio file. Moving it to the right increases the speed, moving it to the left decreases the speed.</p>
          </li>
          <li>
            <h3>Choose the audio format</h3>
            <p>Save the audio file in the desired format (mp3, m4a, m4r, flac, or wav) and click "Save" to download it.</p>
          </li>
      </ul>
    </div>
  );
}

export default ChangeAudioSpeed;
>>>>>>> friend-repo/main
