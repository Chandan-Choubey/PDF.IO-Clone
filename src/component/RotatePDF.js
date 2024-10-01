<<<<<<< HEAD
// src/component/RotatePdf.js
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import "../Css/RotatePDF.css";

const RotatePdf = ({ onClose }) => {
  const { pdfFile, setPdfFile, setRotatedPdfUrl, rotatedPdfUrl } =
    useContext(PdfContext);
  const [isRotating, setIsRotating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rotationDirection, setRotationDirection] = useState("right");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setSelectedFileName(file.name);
      setErrorMessage("");
    } else {
      setPdfFile(null);
      setSelectedFileName("");
      setErrorMessage("Please select a valid PDF file.");
    }
  };

  const handleDropRejected = () => {
    setErrorMessage("Only PDF files are accepted.");
  };

  const handleRotate = async () => {
    if (!pdfFile) {
      setErrorMessage("Please select a PDF file first.");
      return;
    }

    setIsRotating(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("rotationDirection", rotationDirection);

    try {
      const response = await fetch("/rotate-pdf-form", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRotatedPdfUrl(url);
      } else {
        setErrorMessage("Failed to rotate PDF.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while rotating the PDF.");
    } finally {
      setIsRotating(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "application/pdf",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div className="rotatePdf featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Rotate PDF</h2>

      {/* Drag-and-drop zone */}
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <p>
          {selectedFileName ||
            "Drag & Drop your PDF file here, or click to select"}
        </p>
      </div>

      <div className="rotationOptions">
        <label>
          <input
            type="radio"
            name="rotationDirection"
            value="right"
            checked={rotationDirection === "right"}
            onChange={(e) => setRotationDirection(e.target.value)}
          />
          Rotate Right
        </label>
        <label>
          <input
            type="radio"
            name="rotationDirection"
            value="left"
            checked={rotationDirection === "left"}
            onChange={(e) => setRotationDirection(e.target.value)}
          />
          Rotate Left
        </label>
        <label>
          <input
            type="radio"
            name="rotationDirection"
            value="upsideDown"
            checked={rotationDirection === "upsideDown"}
            onChange={(e) => setRotationDirection(e.target.value)}
          />
          Upside Down
        </label>
      </div>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <button onClick={handleRotate} disabled={isRotating}>
        {isRotating ? "Rotating..." : "Rotate PDF"}
      </button>
      {rotatedPdfUrl && !isRotating && (
        <div className="rotatedPdf">
          <a href={rotatedPdfUrl} target="_blank" rel="noopener noreferrer">
            View Rotated PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default RotatePdf;
=======
import React, { useContext, useState } from 'react';
import { PdfContext } from '../PdfContext';
import '../Css/RotatePDF.css';

const RotatePdf = ({ onClose }) => {
  const { pdfFile, setPdfFile, rotatedPdfUrl, setRotatedPdfUrl } = useContext(PdfContext);
  const [isRotating, setIsRotating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setSelectedFileName(file.name); // Set selected file name
      setErrorMessage(''); // Clear error message when valid file is selected
    } else {
      setPdfFile(null);
      setSelectedFileName('');
      setErrorMessage('Please select a valid PDF file.');
    }
  };

  const handleRotate = () => {
    if (!pdfFile) {
      setErrorMessage('Please select a PDF file first.');
      return;
    }

    setIsRotating(true);
    setErrorMessage(''); 

    setTimeout(() => {
      setRotatedPdfUrl('https://via.placeholder.com/300x400.png?text=Rotated+PDF');
      setIsRotating(false);
    }, 2000);
  };

  return (
    <div className="rotatePdf featureComponent">
      <button className="closeButton" onClick={onClose}>X</button>
      <h2>Rotate PDF</h2>
      <label className="fileLabel" htmlFor="fileInput">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 
          1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z"/>
        </svg>
        <span>{selectedFileName ? selectedFileName : 'Choose file'}</span>
        <input id="fileInput" type="file" accept=".pdf" onChange={handleFileChange} />
      </label>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <button onClick={handleRotate} disabled={isRotating}>
        {isRotating ? 'Rotating...' : 'Rotate PDF'}
      </button>
      {rotatedPdfUrl && (
        <div className="rotatedPdf">
          <a href={rotatedPdfUrl} target="_blank" rel="noopener noreferrer">
            View Rotated PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default RotatePdf;
>>>>>>> friend-repo/main
