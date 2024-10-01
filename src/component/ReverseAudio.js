<<<<<<< HEAD
// src/component/ReverseAudio.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ReverseAudio = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAudioFile(file);
      setErrorMessage("");
    }
  };

  const handleDropRejected = () => {
    setErrorMessage("Only audio files are accepted.");
  };

  const handleReverse = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audioFile", audioFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/reverse-audio",
        formData,
        {
          responseType: "blob",
        }
      );

      const reversedAudioUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );
      setDownloadUrl(reversedAudioUrl);
    } catch (error) {
      console.error("Error reversing audio:", error);
      setErrorMessage("An error occurred while processing the audio.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "audio/*",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div className="reverseAudio">
      <h2>Reverse Audio</h2>

      {/* Drag-and-drop zone */}
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <p>
          {audioFile
            ? audioFile.name
            : "Drag & Drop your audio file here, or click to select"}
        </p>
      </div>

      <button onClick={handleReverse} disabled={!audioFile}>
        Reverse Audio
      </button>
      <button onClick={onClose}>Close</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {downloadUrl && (
        <div>
          <h3>Reversed Audio:</h3>
          <audio controls src={downloadUrl}></audio>
          <br />
          <a className="btn" href={downloadUrl} download="reversed-audio.mp3">
            Download Reversed Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default ReverseAudio;
=======
// src/component/ReverseAudio.js
import React, { useState } from 'react';

const ReverseAudio = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleReverse = () => {
    if (audioFile) {
      alert(`Reversing audio: ${audioFile.name}`);
    } else {
      alert('Please select an audio file first.');
    }
  };

  return (
    <div>
      <h2>Reverse Audio</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleReverse}>Reverse Audio</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ReverseAudio;
>>>>>>> friend-repo/main
