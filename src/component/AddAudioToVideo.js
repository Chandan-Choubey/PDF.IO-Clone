import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../Css/AddAudioToVideo.css";

const AddAudioToVideo = ({ onClose }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: {
        "video/*": [".mp4", ".webm", ".ogg"],
      },
      onDrop: (acceptedFiles) => {
        setVideoFile(acceptedFiles[0]);
        setErrorMessage("");
      },
      onDropRejected: () => {
        setErrorMessage("Please drop a valid video file.");
      },
    });

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } =
    useDropzone({
      accept: {
        "audio/*": [".mp3", ".wav", ".ogg"],
      },
      onDrop: (acceptedFiles) => {
        setAudioFile(acceptedFiles[0]);
        setErrorMessage("");
      },
      onDropRejected: () => {
        setErrorMessage("Please drop a valid audio file.");
      },
    });

  const handleSubmit = async () => {
    if (!videoFile || !audioFile) {
      setErrorMessage("Please select both a video and audio file.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("audio", audioFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/add-audio-to-video",
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
      link.setAttribute("download", "video_with_audio.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccessMessage("Audio added to video successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data ||
          "An error occurred while processing your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-audio-to-video">
      <h2>Add Audio to Video</h2>

      <div
        className="dropzone"
        {...getVideoRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <input {...getVideoInputProps()} />
        {videoFile ? (
          <p>Selected video: {videoFile.name}</p>
        ) : (
          <p>Drag and drop your video file here, or click to select</p>
        )}
      </div>

      <div
        className="dropzone"
        {...getAudioRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <input {...getAudioInputProps()} />
        {audioFile ? (
          <p>Selected audio: {audioFile.name}</p>
        ) : (
          <p>Drag and drop your audio file here, or click to select</p>
        )}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Add Audio to Video"}
      </button>
      <button onClick={onClose}>Close</button>

      <ul className="data">
        <li>
          <h2 className="heading">How to put music over a video</h2>
          <p>
            You can add audio files to your video, align it on the timeline,
            adjust its balance and do other edits. Follow these instructions to
            create your unique video.
          </p>
        </li>
        <li>
          <h3>Upload video</h3>
          <p>
            Open Music Adding tool in your browser on your computer or a
            smartphone. Open file or drag and drop the video.
          </p>
        </li>
        <li>
          <h3>Add audio</h3>
          <p>
            Click Add at the bottom of the editing window to select an audio
            file and it'll be added as a separate track. Crop it and adjust
            Volume by clicking Sound.
          </p>
        </li>
        <li>
          <h3>Choose an output video format</h3>
          <p>
            Click on the gear icon next to Save to see the encoding settings.
            MP4 will work for the web, MKV for offline use, and MOV for Apple
            devices.
          </p>
        </li>
        <li>
          <h3>Save and continue your work</h3>
          <p>
            Now you can download the video with your audio as a single file.
            Save it in your device's memory or share it on social media.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default AddAudioToVideo;
