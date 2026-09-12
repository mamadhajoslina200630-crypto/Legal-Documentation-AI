import React, { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div id="workspace-search-bar" style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
      <Search
        size={18}
        color="var(--text-muted)"
        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
      />
      <input
        id="input-workspace-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search documents, clauses, or legal concepts..."
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem 0.5rem 2.5rem",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          color: "var(--text-primary)",
          fontSize: "0.875rem",
          outline: "none",
        }}
      />
    </div>
  );
}

export default SearchBar;
