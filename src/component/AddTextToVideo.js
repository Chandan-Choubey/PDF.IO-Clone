import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const AddTextToVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);

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
    accept: "video/*",
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

    try {
      const response = await axios.post(
        "http://localhost:8080/add-text-to-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProcessedVideoUrl(response.data.videoUrl);
      setSuccessMessage("Text added to video successfully.");
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = processedVideoUrl;
    link.setAttribute("download", "video_with_text.mp4");
    document.body.appendChild(link);
    link.click();
    link.remove();
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
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />

      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={handleTextChange}
      />
      {text && <p>Text: {text}</p>}

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </button>
      <button onClick={onClose}>Close</button>

      {processedVideoUrl && (
        <div>
          <h3>Processed Video:</h3>
          <video controls width="500">
            <source src={processedVideoUrl} type="video/mp4" />
          </video>
          <button onClick={handleDownload}>Download Video</button>
        </div>
      )}
    </div>
  );
};

export default AddTextToVideo;
