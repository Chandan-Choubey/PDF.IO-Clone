<<<<<<< HEAD
// src/component/MergePDF.js
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PdfContext } from "../PdfContext";
import "../Css/MergeComponent.css";

const MergePDF = ({ onClose }) => {
  const { pdfFile, setPdfFile, isMerging, setIsMerging } =
    useContext(PdfContext);
  const [messages, setMessages] = useState({ success: "", error: "" });

  const handleDrop = (acceptedFiles) => {
    const [file1, file2] = acceptedFiles;
    if (acceptedFiles.length > 2) {
      setMessages({ success: "", error: "You can only upload two files." });
      return;
    }

    if (
      file1?.type !== "application/pdf" ||
      file2?.type !== "application/pdf"
    ) {
      setMessages({ success: "", error: "Please select only PDF files." });
      return;
    }

    setPdfFile({
      file1,
      file2,
    });
    setMessages({ success: "", error: "" });
  };

  const handleDropRejected = () => {
    setMessages({
      success: "",
      error: "Invalid file type. Please upload PDF files only.",
    });
  };

  const handleMergePdfs = async () => {
    const { file1, file2 } = pdfFile;
    if (!file1 || !file2) {
      setMessages({
        success: "",
        error: "Please select two valid PDF files to merge.",
      });
      return;
    }

    setIsMerging(true);
    setMessages({ success: "", error: "" });

    const formData = new FormData();
    formData.append("pdfs", file1);
    formData.append("pdfs", file2);

    try {
      const response = await fetch("http://localhost:8080/merge", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "merged.pdf";
        link.click();

        window.URL.revokeObjectURL(url);

        setMessages({
          success: "PDFs have been merged successfully!",
          error: "",
        });
      } else {
        setMessages({
          success: "",
          error: "An error occurred while merging the PDFs.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessages({
        success: "",
        error: "An error occurred while merging the PDFs.",
      });
    } finally {
      setIsMerging(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".pdf",
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    multiple: true,
  });

  return (
    <div className="mergePdfComponent featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Merge PDFs</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#e0e0e0" : "#f9f9f9",
          borderColor: "#ccc",
        }}
      >
        <input {...getInputProps()} />
        {pdfFile.file1 && pdfFile.file2 ? (
          <p>{`${pdfFile.file1.name} & ${pdfFile.file2.name}`}</p>
        ) : (
          <p>
            {isDragActive
              ? "Drop the PDF files here..."
              : "Drag 'n' drop PDF files here, or click to select files"}
          </p>
        )}
      </div>
      <button
        className="actionButton"
        onClick={handleMergePdfs}
        disabled={isMerging}
      >
        {isMerging ? "Merging..." : "Merge PDFs"}
      </button>
      {messages.error && <p className="errorMessage">{messages.error}</p>}
      {messages.success && <p className="successMessage">{messages.success}</p>}
      {isMerging && <p>Merging your PDFs, please wait...</p>}
    </div>
  );
};

export default MergePDF;
=======
import React, { useContext, useState } from 'react';
import { PdfContext } from '../PdfContext';
import '../Css/MergeComponent.css';

const MergePDF = ({ onClose }) => {
  const { pdfFile, setPdfFile, isMerging, setIsMerging } = useContext(PdfContext);
  const [selectedFile1Name, setSelectedFile1Name] = useState('');
  const [selectedFile2Name, setSelectedFile2Name] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(prevState => ({ ...prevState, file1: file }));
      setSelectedFile1Name(file.name);
    } else {
      setPdfFile(prevState => ({ ...prevState, file1: null }));
      setSelectedFile1Name('');
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(prevState => ({ ...prevState, file2: file }));
      setSelectedFile2Name(file.name);
    } else {
      setPdfFile(prevState => ({ ...prevState, file2: null }));
      setSelectedFile2Name('');
    }
  };

  const simulateMergePdfs = () => {
    if (!pdfFile || !pdfFile.file1 || !pdfFile.file2) {
      setErrorMessage('Please select two valid PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setSuccessMessage('PDFs have been merged successfully (simulated)!');
    }, 2000);
  };

  return (
    <div className="mergePdfComponent featureComponent">
      <button className="closeButton" onClick={onClose}>X</button>
      <h2>Merge PDFs</h2>
      <div className="fileInputContainer">
        <label className="fileLabel">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z"/>
          </svg>
          <span>{selectedFile1Name ? selectedFile1Name : 'Select PDF 1'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange1} />
        </label>
        <label className="fileLabel">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z"/>
          </svg>
          <span>{selectedFile2Name ? selectedFile2Name : 'Select PDF 2'}</span>
          <input type="file" accept=".pdf" onChange={handleFileChange2} />
        </label>
      </div>
      <button className="actionButton" onClick={simulateMergePdfs} disabled={isMerging}>
        {isMerging ? 'Merging...' : 'Merge PDFs'}
      </button>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}
      {isMerging && <p>Merging your PDFs, please wait...</p>}
    </div>
  );
};

export default MergePDF;
>>>>>>> friend-repo/main
