<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const CropVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [x, setX] = useState(100);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
  };

  const handleDropRejected = () => {
    alert("Invalid file type. Please select a video file.");
  };

  const handleCrop = async () => {
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
    formData.append("x", x);
    formData.append("y", y);
    formData.append("width", width);
    formData.append("height", height);

    try {
      const response = await axios.post(
        "http://localhost:8080/crop-video",
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
      setSuccessMessage("Video cropped successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while cropping the video."
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
    <div className="crop-video">
      <h2>Crop Video</h2>
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
          <p>Drag 'n' drop a video file here, or click to select a file</p>
        )}
      </div>

      <div>
        <label htmlFor="x">X:</label>
        <input
          type="number"
          id="x"
          value={x}
          onChange={(e) => setX(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="y">Y:</label>
        <input
          type="number"
          id="y"
          value={y}
          onChange={(e) => setY(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="width">Width:</label>
        <input
          type="number"
          id="width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="height">Height:</label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <button onClick={handleCrop} disabled={isSubmitting}>
        {isSubmitting ? "Cropping..." : "Crop Video"}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && downloadUrl && (
        <div>
          <p className="success-message">{successMessage}</p>
          <a href={downloadUrl} download={`cropped_video.mp4`}>
            Download Cropped Video
          </a>
        </div>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CropVideo;
=======
// src/component/CropVideo.js
import React, { useState } from 'react';

const CropVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleCrop = () => {
    if (videoFile) {
      alert(`Cropping video: ${videoFile.name}`);
    } else {
      alert('Please select a video file first.');
    }
  };

  return (
    <div>
      <h2>Crop Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleCrop}>Crop Video</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CropVideo;
>>>>>>> friend-repo/main
