<<<<<<< HEAD
import React, { useState, useRef } from "react";

const VoiceRecorder = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = () => {
    setIsRecording(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        const chunks = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          setAudioBlob(blob);
        };

        mediaRecorderRef.current.start();
      })
      .catch((error) => {
        console.error("Error accessing audio stream:", error);
        alert("Could not access the microphone.");
        setIsRecording(false);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("No recording to save");
    }
  };

  return (
    <div>
      <h2>Voice Recorder</h2>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <button onClick={handleSaveRecording} disabled={!audioBlob}>
        Save Recording
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VoiceRecorder;
=======
// src/component/VoiceRecorder.js
import React, { useState } from 'react';

const VoiceRecorder = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Placeholder for actual recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAudioBlob(new Blob()); // Placeholder for actual audio blob
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      alert('Saving recording');
    } else {
      alert('No recording to save');
    }
  };

  return (
    <div>
      <h2>Voice Recorder</h2>
      <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={handleSaveRecording} disabled={!audioBlob}>
        Save Recording
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VoiceRecorder;
>>>>>>> friend-repo/main
