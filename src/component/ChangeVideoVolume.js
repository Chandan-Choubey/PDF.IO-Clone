<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ChangeVolume = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
    setErrorMessage("");
  };

  const handleDropRejected = () => {
    setErrorMessage("Invalid file type. Please select a video file.");
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleApplyVolume = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setDownloadUrl("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("volume", volume);

    try {
      const response = await axios.post(
        "http://localhost:8080/change-video-volume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(downloadUrl);
      setSuccessMessage("Volume changed successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while changing the volume."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "video/*": [".mp4", ".avi", ".mov", ".mkv"],
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
          <p>Drag 'n' drop a video file here, or click to select a file</p>
        )}
      </div>

      <div>
        <label htmlFor="volume">Volume:</label>
        <input
          type="range"
          id="volume"
          min="0"
          max="2"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{volume * 100}%</span>
      </div>

      <button onClick={handleApplyVolume} disabled={isSubmitting}>
        {isSubmitting ? "Applying..." : "Apply Volume"}
      </button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && downloadUrl && (
        <div>
          <p className="success-message">{successMessage}</p>
          <a href={downloadUrl} download={`volume_changed_video.mp4`}>
            Download Video
          </a>
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ChangeVolume;
=======
// src/component/ChangeVolume.js
import React, { useState } from 'react';

const ChangeVolume = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [volume, setVolume] = useState(1);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleApplyVolume = () => {
    if (videoFile) {
      alert(`Changing volume of ${videoFile.name} to ${volume}`);
    } else {
      alert('Please select a video file first.');
    }
  };

  return (
    <div>
      <h2>Change Volume</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
      <button onClick={handleApplyVolume}>Apply Volume</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ChangeVolume;
>>>>>>> friend-repo/main
