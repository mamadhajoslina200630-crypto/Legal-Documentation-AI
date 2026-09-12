import React from "react";
import { BookOpen } from "lucide-react";
import { useDocumentContext } from "../../context/DocumentContext";

export function SimpleExplanationToggle() {
  const { isSimplifiedView, setIsSimplifiedView } = useDocumentContext();

  return (
    <button
      id="btn-toggle-simple-explanation"
      onClick={() => setIsSimplifiedView(!isSimplifiedView)}
      className={`btn ${isSimplifiedView ? "btn-primary" : "btn-secondary"}`}
      style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
    >
      <BookOpen size={14} />
      {isSimplifiedView ? "Plain Language: ON" : "Plain Language"}
    </button>
  );
}

export default SimpleExplanationToggle;
