// src/component/RotateVideo.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const RotateVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setErrorMessage("");
    } else {
      setVideoFile(null);
      setErrorMessage("Please select a valid video file.");
    }
  };

  const handleDropRejected = () => {
    setErrorMessage("Only video files are accepted.");
  };

  const handleRotate = async () => {
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
    formData.append("angle", angle);

    try {
      const response = await axios.post(
        "http://localhost:8080/rotate-video",
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
      setSuccessMessage("Video rotated successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while rotating the video."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "video/*",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Rotate Video</h2>

      {/* Drag-and-drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          marginBottom: "10px",
          backgroundColor: isDragActive ? "#e0e0e0" : "white",
        }}
      >
        <input {...getInputProps()} />
        <p>
          {videoFile
            ? videoFile.name
            : "Drag & Drop your video file here, or click to select"}
        </p>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="angle">Rotation Angle (degrees):</label>
        <input
          type="number"
          id="angle"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          style={{ marginLeft: "10px", width: "60px" }}
        />
      </div>
      <button onClick={handleRotate} disabled={isSubmitting}>
        {isSubmitting ? "Rotating..." : "Rotate Video"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && downloadUrl && (
        <div style={{ marginTop: "10px" }}>
          <p style={{ color: "green" }}>{successMessage}</p>
          <a
            href={downloadUrl}
            download={`rotated_video.mp4`}
            style={{ color: "blue" }}
          >
            Download Rotated Video
          </a>
        </div>
      )}
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Close
      </button>
    </div>
  );
};

export default RotateVideo;
