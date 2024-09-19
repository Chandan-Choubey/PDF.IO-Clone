// src/component/ImageToPdf.js
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import axios from "axios";
import "../Css/ImageToPdf.css";

const ImageToPdf = ({ onClose }) => {
  const { imageFile, setImageFile, setPdfUrl } = useContext(PdfContext);
  const [isConverting, setIsConverting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setSelectedFileName(file.name);
    } else {
      setImageFile(null);
      setSelectedFileName("");
      alert("Please select a valid image file.");
    }
  };

  const handleDropRejected = () => {
    alert("Invalid file type. Please select an image file.");
  };

  const convertImageToPdf = async () => {
    if (!imageFile) {
      alert("Please select an image file first.");
      return;
    }

    setIsConverting(true);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/image-to-pdf",
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "image.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPdfUrl(url);
      setSuccessMessage("Image has been successfully converted to PDF.");
      alert("Image has been successfully converted to PDF.");
    } catch (error) {
      console.error("Error converting image to PDF:", error);
      alert("Error converting image to PDF.");
    } finally {
      setIsConverting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: "image/*",
      onDrop: handleDrop,
      onDropRejected: handleDropRejected,
    });

  return (
    <div className="imageToPdf featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Image to PDF</h2>
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
            {selectedFileName
              ? selectedFileName
              : "Drag 'n' drop an image file here, or click to select one"}
          </p>
        )}
      </div>
      <button onClick={convertImageToPdf} disabled={isConverting}>
        {isConverting ? "Converting..." : "Convert to PDF"}
      </button>
      {successMessage && <p className="successMessage">{successMessage}</p>}
    </div>
  );
};

export default ImageToPdf;
