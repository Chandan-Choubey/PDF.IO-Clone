import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FlipVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [flipType, setFlipType] = useState("horizontal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setSuccessMessage("");
      setErrorMessage("");
      setDownloadUrl("");
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handleDropRejected = () => {
    alert("Invalid file type. Please select a video file.");
  };

  const handleFlip = async () => {
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
    formData.append("flipType", flipType);

    try {
      const response = await axios.post(
        "http://localhost:8080/flip-video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      setDownloadUrl(blobUrl);
      setSuccessMessage("Video flipped successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data || "An error occurred while flipping the video."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "video/*": [],
      },
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div className="flip-video-container">
      <h2>Flip Video</h2>

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

      <div className="flip-type-selection">
        <label>Flip Type:</label>
        <div>
          <label>
            <input
              type="radio"
              value="horizontal"
              checked={flipType === "horizontal"}
              onChange={(e) => setFlipType(e.target.value)}
            />
            Horizontal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              checked={flipType === "vertical"}
              onChange={(e) => setFlipType(e.target.value)}
            />
            Vertical
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleFlip} disabled={isSubmitting}>
          {isSubmitting ? "Flipping..." : "Flip Video"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Download Button */}
      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download={`flipped_video.mp4`}>
            <button>Download Flipped Video</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default FlipVideo;
