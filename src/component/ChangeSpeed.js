// src/component/ChangeVideoSpeed.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ChangeVideoSpeed = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [speed, setSpeed] = useState(1);
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

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  const handleApplySpeed = async () => {
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setDownloadUrl("");

    const formData = new FormData();
    formData.append("speed", speed);
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/change-video-speed",
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
      setSuccessMessage("Video speed changed successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while changing video speed."
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
    <div className="change-video-speed">
      <h2>Change Video Speed</h2>
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

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {videoFile && (
        <>
          <label htmlFor="speed">Speed: {speed}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            id="speed"
            value={speed}
            onChange={handleSpeedChange}
          />
          <p>Selected Speed: {speed}x</p>
          <button onClick={handleApplySpeed} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Apply Speed"}
          </button>
        </>
      )}

      <button onClick={onClose}>Close</button>

      {successMessage && downloadUrl && (
        <div>
          <p className="success-message">{successMessage}</p>
          <a href={downloadUrl} download="speed_changed_video.mp4">
            Download Modified Video
          </a>
        </div>
      )}
    </div>
  );
};

export default ChangeVideoSpeed;
