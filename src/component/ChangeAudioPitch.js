<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function ChangeAudioPitch({ onClose }) {
  const [audioFile, setAudioFile] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    setAudioFile(acceptedFiles[0]);
    setErrorMessage("");
  };

  const handleDropRejected = (rejectedFiles) => {
    setErrorMessage("Invalid file type. Please select an audio file.");
  };

  const applyPitchChange = async () => {
    if (!audioFile) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("pitch", pitch);

    try {
      const response = await axios.post(
        "http://localhost:8080/change-pitch",
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
      console.error("Error applying pitch change:", error);
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
      <h2>Change Audio Pitch</h2>

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
            Pitch:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </label>
          <button onClick={applyPitchChange}>Apply Pitch Change</button>
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

      <ul className="data">
        <li>
          <h2 className="heading">How to change the key of a song?</h2>
        </li>
        <li>
          <h3>Upload File</h3>
          <p>
            Select an audio file from your device, Dropbox, or Google Drive. You
            can also open files via URL.
          </p>
        </li>
        <li>
          <h3>Adjust the pitch</h3>
          <p>
            Select an interval in the file and shift the pitch by moving the
            slider left and right.
          </p>
        </li>
        <li>
          <h3>Download result</h3>
          <p>
            After you finish editing, pick a format (mp3, m4a, m4r, flac, or
            wav) and click "Save" to download the file.
          </p>
        </li>
      </ul>
    </div>
  );
}

export default ChangeAudioPitch;
=======
// src/component/ChangeAudioPitch.js
import React, { useState } from 'react';

function ChangeAudioPitch({ onClose }) {
  const [audioFile, setAudioFile] = useState(null);
  const [pitch, setPitch] = useState(1); // 1 is normal pitch

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handlePitchChange = (e) => {
    setPitch(e.target.value);
  };

  const applyPitchChange = () => {
    // Simulate applying pitch change
    console.log(`Applying pitch change to ${audioFile.name} with pitch level: ${pitch}`);
  };

  return (
    <div className="tool-container">
      <h2>Change Audio Pitch</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioFile && (
        <>
          <label>
            Pitch:
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={handlePitchChange} />
          </label>
          <button onClick={applyPitchChange}>Apply Pitch Change</button>
        </>
      )}
      <button onClick={onClose}>Close</button>
      <ul className='data'>
          <li>
            <h2 className='heading'>How to change the key of a song?</h2>
          </li>
          <li>
            <h3>Upload File</h3>
            <p>Select an audio file from your device, Dropbox, or Google Drive. You can also open files via URL.</p>
          </li>
          <li>
            <h3>Adjust the pitch</h3>
            <p>Select an interval in the file and shift the pitch by moving the slider left and right.</p>
          </li>
          <li>
            <h3>Download result</h3>
            <p>After you finish editing, pick a format (mp3, m4a, m4r, flac, or wav) and click "Save" to download the file.</p>
          </li>
        </ul>
    </div>
  );
}

export default ChangeAudioPitch;
>>>>>>> friend-repo/main
