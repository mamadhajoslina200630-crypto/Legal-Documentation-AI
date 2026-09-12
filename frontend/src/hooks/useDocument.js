import { useState, useEffect } from "react";
import api from "../api/client";
import { useDocumentContext } from "../context/DocumentContext";

export function useDocument(documentId) {
  const { activeDocument, setActiveDocument } = useDocumentContext();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const pollStatus = async (id) => {
    try {
      const data = await api.get(`/documents/${id}/status`);
      setStatus(data.status);
      return data;
    } catch (err) {
      setError(err);
    }
  };

  const upload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/documents/upload", formData);
      setActiveDocument(res);
      setStatus("pending");
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    activeDocument,
    loading,
    status,
    error,
    upload,
    pollStatus,
  };
}
