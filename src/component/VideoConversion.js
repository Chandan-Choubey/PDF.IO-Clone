import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "../Css/VideoTool.css";

function VideoConversion({ onClose }) {
  const [videoFile, setVideoFile] = useState(null);
  const [format, setFormat] = useState("mp4");

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

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const convertVideo = async () => {
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("format", format);

    try {
      const response = await axios.post(
        "http://localhost:8080/convert-video",
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
      link.setAttribute("download", `converted_video.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error converting video:", error);
      alert("An error occurred while converting the video.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/avi": [".avi"],
      "video/mov": [".mov"],
      "video/mkv": [".mkv"],
    },
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div className="tool-container">
      <h2>Video Conversion</h2>

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
        <label htmlFor="format">Select Format:</label>
        <select id="format" value={format} onChange={handleFormatChange}>
          <option value="mp4">MP4</option>
          <option value="avi">AVI</option>
          <option value="mov">MOV</option>
          <option value="mkv">MKV</option>
        </select>
      </div>

      {videoFile && <button onClick={convertVideo}>Convert Video</button>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default VideoConversion;
