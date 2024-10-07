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
