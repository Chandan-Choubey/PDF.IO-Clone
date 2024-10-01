<<<<<<< HEAD
import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const AddImageToVideo = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!videoFile || !imageFile) {
      setErrorMessage("Please select both a video and image file.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/add-image-to-video",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video_with_image.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccessMessage("Image added to video successfully.");
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

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: {
        "video/mp4": [".mp4"],
        "video/webm": [".webm"],
        "video/ogg": [".ogg"],
      },

      onDrop: (acceptedFiles) => {
        setVideoFile(acceptedFiles[0]);
      },
    });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
      },
      onDrop: (acceptedFiles) => {
        setImageFile(acceptedFiles[0]);
      },
    });

  return (
    <div className="add-image-to-video">
      <h2>Add Image to Video</h2>

      <div
        {...getVideoRootProps()}
        className="dropzone"
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
          <p>Drag & drop a video file here, or click to select one</p>
        )}
      </div>

      <div
        {...getImageRootProps()}
        className="dropzone"
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <input {...getImageInputProps()} />
        {imageFile ? (
          <p>Selected image: {imageFile.name}</p>
        ) : (
          <p>Drag & drop an image file here, or click to select one</p>
        )}
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

export default AddImageToVideo;
=======
// src/component/AddImageToVideo.js

import React, { useState } from 'react';

const AddImageToVideo = ({ onClose }) => {
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    // Add logic to add image to video
  };

  return (
    <div className="add-image-to-video">
      <h2>Add Image to Video</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageFile && <p>Selected image: {imageFile.name}</p>}
      <button onClick={onClose}>Close</button>

      <ul className='data'>
          <li>
            <h2 className='heading'>How to add a picture to a video</h2>
            <p>Adding an image to a video takes a few minutes only with our app. You can export images in different file formats (jpg, png, gif, and others) and edit them flexibly, thanks to the full-fledged range of in-built tools. </p>
          </li>
          <li>
            <h3>Upload video</h3>
            <p>To start with, open this tool in your browser on any device (PC, tablet, or phone). Click 'Add file' and upload your video. Note that for large files, it may take up to ten minutes to add them to the interface. </p>
          </li>
          <li>
            <h3>Add Image</h3>
            <p>Add a picture by finding the corresponding tool in the sidebar and upload a file from your device by dragging it in the interface or choosing it on your PC. Our tool supports images of JPG, JPEG, PNG, GIF, and other formats. </p>
          </li>
          <li>
            <h3>Choose the video format</h3>
            <p>After adding pictures and making all other adjustments with the platform instruments at your fingertips, you can download the video. Choose the output format after clicking on a corresponding icon in the menu or tapping 'Save'. </p>
          </li>
          <li>
            <h3>Save and continue</h3>
            <p>Once you click 'Save', your result will be automatically downloaded to your device. The video will preserve its original top quality. </p>
          </li>
        </ul>
    </div>
  );
};

export default AddImageToVideo;
>>>>>>> friend-repo/main
