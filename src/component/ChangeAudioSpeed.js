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
