<<<<<<< HEAD
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
=======
import React, { useContext, useState } from 'react';
import { PdfContext } from '../PdfContext';
import '../Css/ImageToPdf.css';

const ImageToPdf = ({ onClose }) => {
  const { imageFile, setImageFile, setPdfUrl } = useContext(PdfContext);
  const [isConverting, setIsConverting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFile(e.target.result);
        setSelectedFileName(file.name); // Set selected file name
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setSelectedFileName('');
      alert('Please select a valid image file.');
    }
  };

  const convertImageToPdf = () => {
    if (!imageFile) {
      alert('Please select an image file first.');
      return;
    }

    setIsConverting(true);

    // Simulate the conversion process
    setTimeout(() => {
      const pdfContainer = document.createElement('div');
      const imgElement = document.createElement('img');
      imgElement.src = imageFile;
      pdfContainer.appendChild(imgElement);

      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(pdfContainer.innerHTML);
      printWindow.document.close();
      printWindow.print();

      setPdfUrl(imageFile);
      setIsConverting(false);
      setSuccessMessage('Image has been successfully converted to PDF.');
      alert('Image has been successfully converted to PDF.');
    }, 2000);
  };

  return (
    <div className="imageToPdf featureComponent">
      <button className="closeButton" onClick={onClose}>X</button>
      <h2>Image to PDF</h2>
      <label className="fileLabel" htmlFor="imageInput">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z"/>
        </svg>
        <span>{selectedFileName ? selectedFileName : 'Choose file'}</span>
        <input id="imageInput" type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <button onClick={convertImageToPdf} disabled={isConverting}>
        {isConverting ? 'Converting...' : 'Convert to PDF'}
      </button>
      {successMessage && <p className="successMessage">{successMessage}</p>}
    </div>
  );
};

export default ImageToPdf;
>>>>>>> friend-repo/main
