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
