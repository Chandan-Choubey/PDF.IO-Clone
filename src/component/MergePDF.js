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
        {pdfFile?.file1 && pdfFile?.file2 ? (
          <p>{`${pdfFile?.file1.name} & ${pdfFile?.file2.name}`}</p>
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
