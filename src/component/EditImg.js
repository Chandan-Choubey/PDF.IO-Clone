<<<<<<< HEAD
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import "../Css/EditImg.css";

function EditImg({ onClose }) {
  const {
    imageFile,
    setImageFile,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    editedImageUrl,
    setEditedImageUrl,
  } = useContext(PdfContext);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [message, setMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result);
        setSelectedFileName(file.name);
        setMessage("File selected successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setSelectedFileName("");
      setMessage("Please select a valid image file.");
    }
  };

  const handleDropRejected = () => {
    setMessage("Invalid file type. Please select an image file.");
  };

  const handleEdit = () => {
    if (!imageFile) {
      setMessage("Please select an image file first.");
      return;
    }

    setIsEditing(true);
    setMessage("");

    const img = new Image();
    img.src = imageFile;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      setEditedImageUrl(canvas.toDataURL());
      setIsEditing(false);
      setMessage("Image has been edited successfully.");
    };

    img.onerror = () => {
      setIsEditing(false);
      setMessage("Error editing the image.");
    };
  };

  const handleDownload = () => {
    if (!editedImageUrl) return;
    const link = document.createElement("a");
    link.href = editedImageUrl;
    link.download = "edited-image.png";
    link.click();
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div className="editImg featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Edit Image</h2>

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
          <p>Drop the image file here ...</p>
        ) : (
          <p>
            {selectedFileName ||
              "Drag 'n' drop an image file here, or click to select one"}
          </p>
        )}
      </div>

      <div className="controls">
        <label>
          Brightness:
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
          />
        </label>
        <label>
          Contrast:
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(e.target.value)}
          />
        </label>
      </div>

      <button
        className="actionButton"
        onClick={handleEdit}
        disabled={isEditing}
      >
        {isEditing ? "Editing..." : "Edit Image"}
      </button>

      {message && (
        <p
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}

      {editedImageUrl && (
        <div className="editedImage">
          <img src={editedImageUrl} alt="Edited" />
          <div className="downloadContainer">
            <button onClick={handleDownload}>Download Image</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditImg;
=======
import React, { useContext, useState } from 'react';
import { PdfContext } from '../PdfContext';
import '../Css/EditImg.css';

function EditImg({ onClose }) {
  const { imageFile, setImageFile, brightness, setBrightness, contrast, setContrast, editedImageUrl, setEditedImageUrl } = useContext(PdfContext);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFile(e.target.result);
        setSelectedFileName(file.name); // Set selected file name
        setMessage('File selected successfully.');
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setSelectedFileName('');
      setMessage('Please select a valid image file.');
    }
  };

  const handleEdit = () => {
    if (!imageFile) {
      setMessage('Please select an image file first.');
      return;
    }

    setIsEditing(true);

    // Simulated editing logic (you can replace this with actual image processing logic)
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageFile;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setEditedImageUrl(canvas.toDataURL());
        setIsEditing(false);
        setMessage('Image has been edited successfully.');
      };
    }, 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImageUrl;
    link.download = 'edited-image.png';
    link.click();
  };

  return (
    <div className="editImg featureComponent">
      <button className="closeButton" onClick={onClose}>X</button>
      <h2>Edit Image</h2>
      <label className="fileLabel">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z"/>
        </svg>
        <span>{imageFile ? selectedFileName : 'Select Image'}</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <div className="controls">
        <label>
          Brightness:
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
          />
        </label>
        <label>
          Contrast:
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(e.target.value)}
          />
        </label>
      </div>
      <button className="actionButton" onClick={handleEdit} disabled={isEditing}>
        {isEditing ? 'Editing...' : 'Edit Image'}
      </button>
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>
      )}
      {editedImageUrl && (
        <div className="editedImage">
          <img src={editedImageUrl} alt="Edited" />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      )}
    </div>
  );
}

export default EditImg;
>>>>>>> friend-repo/main
