// src/component/LoopVideo.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const LoopVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [loopCount, setLoopCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      setVideoFile(null);
      alert("Please select a valid video file.");
    }
  };

  const handleDropRejected = () => {
    alert("Invalid file type. Please select a video file.");
  };

  const handleLoop = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("loopCount", loopCount);

    try {
      const response = await axios.post(
        "http://localhost:8080/loop-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "looped_video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccessMessage("Video looped and download started successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while looping the video."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: "video/*",
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div>
      <h2>Loop Video</h2>
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
          <p>Drop the video file here ...</p>
        ) : (
          <p>
            {videoFile
              ? videoFile.name
              : "Drag 'n' drop a video file here, or click to select one"}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="loopCount">Loop Count:</label>
        <input
          type="number"
          id="loopCount"
          min="1"
          value={loopCount}
          onChange={(e) => setLoopCount(e.target.value)}
        />
      </div>
      <button onClick={handleLoop} disabled={isSubmitting}>
        {isSubmitting ? "Looping..." : "Loop Video"}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LoopVideo;
