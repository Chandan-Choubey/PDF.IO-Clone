import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../Css/VideoTool.css";

const TrimVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

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
    alert("Only video files are accepted.");
  };

  const handleTrimVideo = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }

    if (
      startTime === "" ||
      endTime === "" ||
      parseFloat(startTime) >= parseFloat(endTime)
    ) {
      alert("Please provide valid start and end times.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    try {
      const response = await axios.post(
        "http://localhost:8080/trim-video",
        formData,
        {
          responseType: "blob",
        }
      );

      const trimmedVideoUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      setDownloadUrl(trimmedVideoUrl);
    } catch (error) {
      console.error("Error trimming video:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "video/*",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div className="trim-video">
      <h2>Trim Video</h2>

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

      <div>
        <input
          type="text"
          placeholder="Start time (in seconds)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="End time (in seconds)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleTrimVideo}>Trim Video</button>
        <button onClick={onClose}>Close</button>

        {downloadUrl && (
          <div>
            <h3>Trimmed Video:</h3>
            <video
              controls
              src={downloadUrl}
              style={{ width: "100%", maxHeight: "400px" }}
            ></video>
            <br />
            <a href={downloadUrl} download="trimmed-video.mp4" className="btn">
              Download Trimmed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrimVideo;
