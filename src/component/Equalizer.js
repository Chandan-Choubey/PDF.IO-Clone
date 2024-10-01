<<<<<<< HEAD
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const Equalizer = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      alert("Please select a valid audio file.");
    }
  };

  const handleDropRejected = () => {
    alert("Invalid file type. Please select an audio file.");
  };

  const handleApplyEqualizer = async () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append("audioFile", audioFile);
      formData.append("bass", bass);
      formData.append("treble", treble);

      try {
        const response = await fetch("http://localhost:8080/apply-equalizer", {
          method: "POST",
          body: formData,
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = audioFile.name.replace(/\.[^/.]+$/, "") + "_equalized.mp3";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error applying equalizer:", error);
      }
    } else {
      alert("Please select an audio file first.");
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "audio/*": [],
      },
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div className="tool-container">
      <h2>Equalizer</h2>

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
          <p>Drop the audio file here ...</p>
        ) : (
          <p>
            {audioFile
              ? audioFile.name
              : "Drag 'n' drop an audio file here, or click to select one"}
          </p>
        )}
      </div>

      {audioFile && (
        <>
          <div>
            <label htmlFor="bassInput">Bass Adjustment:</label>
            <input
              id="bassInput"
              type="range"
              min="-10"
              max="10"
              step="1"
              value={bass}
              onChange={(e) => setBass(e.target.value)}
            />
            <span>{bass}</span>
          </div>

          <div>
            <label htmlFor="trebleInput">Treble Adjustment:</label>
            <input
              id="trebleInput"
              type="range"
              min="-10"
              max="10"
              step="1"
              value={treble}
              onChange={(e) => setTreble(e.target.value)}
            />
            <span>{treble}</span>
          </div>

          <button onClick={handleApplyEqualizer}>Apply Equalizer</button>
        </>
      )}

      <button onClick={onClose}>Close</button>

      <ul className="data">
        <li>
          <h2 className="heading">How to boost bass online?</h2>
        </li>
        <li>
          <h3>Choose an audio file</h3>
          <p>
            Select files directly from your device, open them from cloud storage
            (Dropbox or Google Drive) or enter a URL.
          </p>
        </li>
        <li>
          <h3>Adjust the sound</h3>
          <p>
            Use sliders in the audio equalizer app to modify frequencies and
            decibels or select one of the EQ presets.
          </p>
        </li>
        <li>
          <h3>Choose the file type</h3>
          <p>
            When you are satisfied with the sound, select an audio format (mp3,
            m4a, m4r, flac, or wav) and save it to your device.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default Equalizer;
=======
// src/component/Equalizer.js
import React, { useState } from 'react';

const Equalizer = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleApplyEqualizer = () => {
    if (audioFile) {
      alert(`Applying equalizer to ${audioFile.name} with bass: ${bass} and treble: ${treble}`);
    } else {
      alert('Please select an audio file first.');
    }
  };

  return (
    <div>
      <h2>Equalizer</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <input type="range" min="-10" max="10" step="1" value={bass} onChange={(e) => setBass(e.target.value)} />
      <input type="range" min="-10" max="10" step="1" value={treble} onChange={(e) => setTreble(e.target.value)} />
      <button onClick={handleApplyEqualizer}>Apply Equalizer</button>
      <button onClick={onClose}>Close</button>

      <ul className='data'>
          <li>
            <h2 className='heading'>How to boost bass online?</h2>
          </li>
          <li>
            <h3>Choose an audio file</h3>
            <p>Select files directly from your device, open them from cloud storage (Dropbox or Google Drive) or enter a URL.</p>
          </li>
          <li>
            <h3>Adjust the sound</h3>
            <p>Use sliders in the audio equalizer app to modify frequencies and decibels or select one of the EQ presets.</p>
          </li>
          <li>
            <h3>Choose the file type</h3>
            <p>When you are satisfied with the sound, select an audio format (mp3, m4a, m4r, flac, or wav) and save it to your device.</p>
          </li>
        </ul>
    </div>
  );
};

export default Equalizer;
>>>>>>> friend-repo/main
