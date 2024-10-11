import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const AddTextToVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [text, setText] = useState("");
  const [fontsize, setFontSize] = useState(50);
  const [x, setXPosition] = useState("");
  const [y, setYPosition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video")) {
      setVideoFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please drop a valid video file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/mp4, video/x-matroska, video/x-msvideo, video/quicktime",
    multiple: false,
  });

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!videoFile || !text) {
      setErrorMessage("Please select or drop a video file and enter text.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("text", text);
    formData.append("fontsize", fontsize);
    formData.append("x", x);
    formData.append("y", y);
    try {
      const response = await axios.post(
        "http://localhost:8080/add-text-to-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "video_with_text.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccessMessage(
        "Text added to video and video downloaded successfully."
      );
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage(
        error.response?.data ||
          "An error occurred while processing your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-text-to-video">
      <h2>Add Text to Video</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
        style={{
          border: "2px dashed #cccccc",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the video here...</p>
        ) : (
          <p>Drag & drop a video file here, or click to select one</p>
        )}
      </div>

      {videoFile && <p>Selected video: {videoFile.name}</p>}

      <input
        type="file"
        accept="video/mp4,video/x-matroska,video/x-msvideo,video/quicktime"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={handleTextChange}
      />

      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontsize}
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>

      <div>
        <label>X Position:</label>
        <input
          type="text"
          value={x}
          onChange={(e) => setXPosition(e.target.value)}
        />
      </div>

      <div>
        <label>Y Position:</label>
        <input
          type="text"
          value={y}
          onChange={(e) => setYPosition(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddTextToVideo;
