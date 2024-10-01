<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ChangeVolume = ({ onClose }) => {
  const [volume, setVolume] = useState(50);
  const [audioFile, setAudioFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    setAudioFile(acceptedFiles[0]);
    setErrorMessage("");
  };

  const handleDropRejected = () => {
    setErrorMessage("Invalid file type. Please select an audio file.");
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleApplyVolumeChange = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("volume", volume / 100);

    try {
      const response = await axios.post(
        "http://localhost:8080/change-volume",
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
      console.error("Error changing audio volume:", error);
      alert("An error occurred while processing the audio.");
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
    <div className="change-volume">
      <h2>Change Volume</h2>

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

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {audioFile && (
        <>
          <label>
            Volume:
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </label>
          <p>Volume: {volume}%</p>
          <button onClick={handleApplyVolumeChange}>Apply Volume Change</button>
        </>
      )}

      <button onClick={onClose}>Close</button>

      {downloadUrl && (
        <div>
          <h3>Adjusted Audio:</h3>
          <audio controls src={downloadUrl}></audio>
          <br />
          <a className="btn" href={downloadUrl} download="adjusted-audio.mp3">
            Download Adjusted Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default ChangeVolume;
=======
// src/component/ChangeAudioVolume.js
import React, { useState } from 'react';

function ChangeAudioVolume({ onClose }) {
  const [audioFile, setAudioFile] = useState(null);
  const [volume, setVolume] = useState(1); // 1 is 100% volume

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const applyVolumeChange = () => {
    // Simulate applying volume change
    console.log(`Applying volume change to ${audioFile.name} with volume level: ${volume}`);
  };

  return (
    <div className="tool-container">
      <h2>Change Audio Volume</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioFile && (
        <>
          <label>
            Volume:
            <input type="range" min="0" max="2" step="0.1" value={volume} onChange={handleVolumeChange} />
          </label>
          <button onClick={applyVolumeChange}>Apply Volume Change</button>
        </>
      )}
      <button onClick={onClose}>Close</button>

      <ul className='data'>
          <li>
            <h2 className='heading'>How to make mp3 louder?</h2>
          </li>
          <li>
            <h3>Open file</h3>
            <p>Select a file you want to modify from your device, Dropbox or Google Drive folders, or open it via URL.</p>
          </li>
          <li>
            <h3>Adjust volume</h3>
            <p>Then use the volume slider at the bottom of the app to set the volume you want.</p>
          </li>
          <li>
            <h3>Save modified file</h3>
            <p>Save the audio file in the desired format (mp3, m4a, m4r, flac, or wav) and click "Save" to download it.</p>
          </li>
        </ul>
    </div>
  );
}

export default ChangeAudioVolume;
>>>>>>> friend-repo/main
