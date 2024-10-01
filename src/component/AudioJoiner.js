import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const AudioJoiner = ({ onClose }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleDrop = (acceptedFiles) => {
    setAudioFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleJoinAudio = async () => {
    if (audioFiles.length < 2) {
      alert("Please select at least two audio files to join.");
      return;
    }

    const formData = new FormData();
    audioFiles.forEach((file) => {
      formData.append("audioFiles", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/join-audio",
        formData,
        {
          responseType: "blob",
        }
      );

      const joinedAudioUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      setDownloadUrl(joinedAudioUrl);
    } catch (error) {
      console.error("Error joining audio files:", error);
      alert("An error occurred while joining the audio files.");
    }
  };

  const handleDropRejected = (rejectedFiles) => {
    alert(
      `Some files were rejected. Allowed file types are: .mp3, .wav, .ogg.`
    );
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "audio/*": [".mp3", ".wav", ".ogg"],
      },
      multiple: true,
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div>
      <h2>Audio Joiner</h2>
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
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop audio files here, or click to select files</p>
        )}
      </div>
      <button onClick={handleJoinAudio}>Join Audio</button>

      {audioFiles.length > 0 && (
        <div>
          <h3>Selected Audio Files:</h3>
          <ul>
            {audioFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {downloadUrl && (
        <div>
          <h3>Joined Audio:</h3>
          <audio controls src={downloadUrl}></audio>
          <br />
          <a href={downloadUrl} download="joined-audio.mp3">
            Download Joined Audio
          </a>
        </div>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AudioJoiner;
