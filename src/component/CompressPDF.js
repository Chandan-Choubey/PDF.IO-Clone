import React, { useContext, useState } from "react";
import { PdfContext } from "../PdfContext";
import "../Css/CompressPDF.css";
import axios from "axios";

const CompressPDF = ({ onClose }) => {
  const { pdfFile, setPdfFile, isCompressing, setIsCompressing } =
    useContext(PdfContext);
  const [fileDetails, setFileDetails] = useState({
    name: "",
    error: "",
    compressMessage: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setFileDetails({ name: file.name, error: "", compressMessage: "" });
    } else {
      setPdfFile(null);
      setFileDetails({
        name: "",
        error: "Please select a valid PDF file.",
        compressMessage: "",
      });
    }
  };

  const handleCompress = async () => {
    if (!pdfFile) {
      setFileDetails((prevState) => ({
        ...prevState,
        error: "Please select a PDF file to compress.",
      }));
      return;
    }

    setIsCompressing(true);
    setFileDetails((prevState) => ({
      ...prevState,
      compressMessage: "",
      error: "",
    }));

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/compress",
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "compressed.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setFileDetails({
        name: "",
        compressMessage: "PDF has been compressed and downloaded successfully.",
        error: "",
      });
    } catch (error) {
      console.error("Error during PDF compression:", error);
      setFileDetails((prevState) => ({
        ...prevState,
        error: "An error occurred while compressing the PDF.",
      }));
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="compressPdfComponent featureComponent">
      <button className="closeButton" onClick={onClose}>
        X
      </button>
      <h2>Compress PDF</h2>
      <label className="fileLabel">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 00-9.9 9h-2a1 1 0 100 2h2.08A9.959 9.959 0 0012 22a10 10 0 009.9-9h2.1a1 1 0 100-2h-2.1A10 10 0 0012 2zm0 18a8 8 0 01-7.9-7h15.8a8 8 0 01-7.9 7zM8 12H6l6-6 6 6h-2v4h-4v-4z" />
        </svg>
        <span>{fileDetails.name || "Select PDF"}</span>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </label>
      <button
        className="actionButton"
        onClick={handleCompress}
        disabled={isCompressing}
      >
        {isCompressing ? "Compressing..." : "Compress PDF"}
      </button>
      {isCompressing && <p>Compressing your PDF, please wait...</p>}
      {fileDetails.error && <p className="errorMessage">{fileDetails.error}</p>}
      {fileDetails.compressMessage && (
        <p className="compressMessage">{fileDetails.compressMessage}</p>
      )}
    </div>
  );
};

export default CompressPDF;
