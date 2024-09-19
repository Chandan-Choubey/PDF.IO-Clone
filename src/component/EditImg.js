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
