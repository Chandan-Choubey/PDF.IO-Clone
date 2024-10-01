<<<<<<< HEAD
// src/component/MergeVideos.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../Css/MergeComponent.css"; // Ensure you have appropriate styles

const MergeVideos = ({ onClose }) => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length < 2) {
      setErrorMessage("Please select at least two video files.");
      return;
    }
    setVideoFiles(acceptedFiles);
    setErrorMessage("");
  };

  const handleDropRejected = () => {
    setErrorMessage("Only video files are accepted.");
  };

  const handleMerge = async () => {
    if (videoFiles.length < 2) {
      setErrorMessage("Please select at least two video files.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setDownloadUrl("");

    const formData = new FormData();
    videoFiles.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/merge-videos",
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
      setSuccessMessage("Videos merged successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while merging the videos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "video/*",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: true,
  });

  return (
    <div className="mergeVideoComponent featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Merge Videos</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#e0e0e0" : "#f9f9f9",
          borderColor: "#ccc",
        }}
      >
        <input {...getInputProps()} />
        {videoFiles.length > 0 ? (
          <p>{videoFiles.map((file) => file.name).join(", ")}</p>
        ) : (
          <p>
            {isDragActive
              ? "Drop the video files here..."
              : "Drag 'n' drop video files here, or click to select files"}
          </p>
        )}
      </div>
      <button onClick={handleMerge} disabled={isSubmitting}>
        {isSubmitting ? "Merging..." : "Merge Videos"}
      </button>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {successMessage && downloadUrl && (
        <div>
          <p className="successMessage">{successMessage}</p>
          <a href={downloadUrl} download="merged_video.mp4">
            Download Merged Video
          </a>
        </div>
      )}
      {isSubmitting && <p>Merging your videos, please wait...</p>}
    </div>
  );
};

export default MergeVideos;
=======
// src/component/MergeVideos.js
import React, { useState } from 'react';

const MergeVideos = ({ onClose }) => {
  const [videoFiles, setVideoFiles] = useState([]);

  const handleFilesChange = (event) => {
    setVideoFiles([...event.target.files]);
  };

  const handleMerge = () => {
    if (videoFiles.length > 1) {
      alert(`Merging ${videoFiles.length} videos.`);
    } else {
      alert('Please select at least two video files.');
    }
  };

  return (
    <div className="mergePdfComponent featureComponent">
      <h2>Merge Videos</h2>
      <input type="file" accept="video/*" multiple onChange={handleFilesChange} />
      <button onClick={handleMerge}>Merge Videos</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default MergeVideos;
>>>>>>> friend-repo/main
