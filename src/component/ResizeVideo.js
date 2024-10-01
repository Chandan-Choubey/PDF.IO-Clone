<<<<<<< HEAD
// src/component/ResizeVideo.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ResizeVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      setErrorMessage("");
    }
  };

  const handleDropRejected = () => {
    setErrorMessage("Only video files are accepted.");
  };

  const handleResize = async () => {
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
    formData.append("width", width);
    formData.append("height", height);

    try {
      const response = await axios.post(
        "http://localhost:8080/resize-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setSuccessMessage("Video resized successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while resizing the video."
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
    <div className="resizeVideo">
      <h2>Resize Video</h2>

      {/* Drag-and-drop zone */}
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <p>
          {videoFile
            ? videoFile.name
            : "Drag & Drop your video file here, or click to select"}
        </p>
      </div>

      <div>
        <label htmlFor="width">Width:</label>
        <input
          type="number"
          id="width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <label htmlFor="height">Height:</label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      <button onClick={handleResize} disabled={isSubmitting}>
        {isSubmitting ? "Resizing..." : "Resize Video"}
      </button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && downloadUrl && (
        <div>
          <p className="success-message">{successMessage}</p>
          <a href={downloadUrl} download="resized_video.mp4">
            Download Resized Video
          </a>
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ResizeVideo;
=======
// src/component/ResizeVideo.js
import React, { useState } from 'react';

const ResizeVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleResize = () => {
    if (videoFile) {
      alert(`Resizing video: ${videoFile.name}`);
    } else {
      alert('Please select a video file first.');
    }
  };

  return (
    <div>
      <h2>Resize Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleResize}>Resize Video</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ResizeVideo;
>>>>>>> friend-repo/main
