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
