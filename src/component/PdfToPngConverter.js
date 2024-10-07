// src/component/PdfToPngConverter.js
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import "../Css/PdfToPngConverter.css";
import axios from "axios";

const PdfToPngConverter = ({ onClose }) => {
  const { pdfFile, setPdfFile } = useContext(PdfContext);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setSelectedFileName(file.name);
      setErrorMessage("");
    } else {
      resetFileState("Please select a valid PDF file.");
    }
  };

  const handleDropRejected = () => {
    setErrorMessage("Only PDF files are accepted.");
  };

  const resetFileState = (error = "") => {
    setPdfFile(null);
    setSelectedFileName("");
    setErrorMessage(error);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setErrorMessage("Please select a PDF file first.");
      return;
    }

    setIsConverting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/png-convert",
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pdfImage.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsConverting(false);
    } catch (error) {
      console.error("Error during PDF conversion:", error);
      setErrorMessage("An error occurred while converting the PDF.");
      setIsConverting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "application/pdf",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: false,
  });

  return (
    <div className="pdfToPngConverter featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>PDF to PNG Converter</h2>

      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />

        <span>
          {selectedFileName ||
            (isDragActive
              ? "Drop the PDF file here..."
              : "Drag & Drop PDF file here, or click to select")}
        </span>
      </div>

      {errorMessage && <p className="errorMessage">{errorMessage}</p>}

      <button onClick={handleConvert} disabled={isConverting}>
        {isConverting ? "Converting..." : "Convert PDF to PNG"}
      </button>
    </div>
  );
};

export default PdfToPngConverter;
