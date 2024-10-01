// src/component/PdfToPptConverter.js
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import "../Css/PdfToPpt.css";

const PdfToPptConverter = ({ onClose }) => {
  const { pdfFile, setPdfFile, isConverting, setIsConverting } =
    useContext(PdfContext);
  const [pptFile, setPptFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file?.type === "application/pdf") {
      setPdfFile({ pdf: file });
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
    setErrorMessage(error);
  };

  const convertPdfToPpt = async () => {
    if (!pdfFile || !pdfFile.pdf) {
      setErrorMessage("Please select a PDF file to convert.");
      return;
    }

    setIsConverting(true);

    const formData = new FormData();
    formData.append("file", pdfFile.pdf);

    try {
      const response = await fetch("/ppt-convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPptFile(url);
        setSuccessMessage("PDF has been converted to PPT successfully!");
      } else {
        setErrorMessage("Failed to convert PDF to PPT.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while converting the PDF.");
    } finally {
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
    <div className="pdfToPptConverter">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Convert PDF to PPT</h2>

      {/* Drag-and-drop zone */}
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? "dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z" />
        </svg>
        <span>
          {pdfFile?.pdf?.name ||
            (isDragActive
              ? "Drop the PDF file here..."
              : "Drag & Drop PDF file here, or click to select")}
        </span>
      </div>

      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}

      <button
        className="actionButton"
        onClick={convertPdfToPpt}
        disabled={isConverting}
      >
        {isConverting ? "Converting..." : "Convert to PPT"}
      </button>

      {pptFile && (
        <div className="pptDownload">
          <a href={pptFile} download="converted-presentation.ppt">
            Download PPT File
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfToPptConverter;
