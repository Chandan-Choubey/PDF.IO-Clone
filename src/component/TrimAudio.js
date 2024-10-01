import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../Css/VideoTool.css";

const TrimAudio = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      setAudioFile(null);
      alert("Please select a valid audio file.");
    }
  };

  const handleDropRejected = () => {
    alert("Only audio files are accepted.");
  };

  const handleTrim = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be greater than start time.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("startTime", startTime);
    formData.append("duration", endTime);

    try {
      const response = await axios.post(
        "http://localhost:8080/trim",
        formData,
        {
          responseType: "blob",
        }
      );

      const trimmedAudioUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      setDownloadUrl(trimmedAudioUrl);
    } catch (error) {
      console.error("Error trimming audio:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "audio/*",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div>
      <h2>Trim Audio</h2>

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
          {audioFile
            ? audioFile.name
            : "Drag & Drop your audio file here, or click to select"}
        </p>
      </div>

      <div>
        <label htmlFor="startTime">Start Time</label>
        <input
          type="number"
          id="startTime"
          placeholder="Start Time (s)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="endTime">End Time</label>
        <input
          type="number"
          id="endTime"
          placeholder="End Time (s)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleTrim}>Trim</button>
        <button onClick={onClose}>Close</button>

        {downloadUrl && (
          <div>
            <h3>Trimmed Audio:</h3>
            <audio controls src={downloadUrl}></audio>
            <br />
            <a className="btn" href={downloadUrl} download="trimmed-audio.mp3">
              Download Trimmed Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrimAudio;
