import React, { useState } from "react";
import { UploadCloud, File, CheckCircle2 } from "lucide-react";
import Button from "../../../components/Button";

export function UploadDropzone({ onFileUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (file) => {
    if (file) {
      setSelectedFile(file);
      if (onFileUpload) onFileUpload(file);
    }
  };

  return (
    <div
      id="upload-dropzone"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        border: `2px dashed ${dragOver ? "var(--accent-indigo)" : "var(--border-subtle)"}`,
        borderRadius: "12px",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        backgroundColor: dragOver ? "rgba(99, 102, 241, 0.05)" : "rgba(255, 255, 255, 0.01)",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("file-input-hidden")?.click()}
    >
      <input
        id="file-input-hidden"
        type="file"
        style={{ display: "none" }}
        accept=".pdf,.docx,.png,.jpg"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "rgba(99, 102, 241, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <UploadCloud size={28} color="var(--accent-indigo)" />
        </div>
        <div>
          <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
            {selectedFile ? selectedFile.name : "Upload Contracts, Judgments, or Court Orders"}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Supports PDF, DOCX, Scanned Court Documents (up to 50MB)
          </p>
        </div>
        {selectedFile ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-emerald)", fontSize: "0.85rem" }}>
            <CheckCircle2 size={16} /> File Selected: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
        ) : (
          <Button variant="secondary" size="sm" id="btn-browse-files">
            Browse Files
          </Button>
        )}
      </div>
    </div>
  );
}

export default UploadDropzone;
