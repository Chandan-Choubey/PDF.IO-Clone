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
