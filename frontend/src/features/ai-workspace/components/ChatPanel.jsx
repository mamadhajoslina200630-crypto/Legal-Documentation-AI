import React, { useState } from "react";
import { Send, Bot, User, BookOpen } from "lucide-react";
import Button from "../../../components/Button";

export function ChatPanel({ messages = [], loading = false, onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (onSendMessage) onSendMessage(input);
    setInput("");
  };

  return (
    <div
      id="chat-panel-container"
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "550px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bot size={20} color="var(--accent-indigo)" />
          <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>Document AI Assistant (RAG Grounded)</h3>
        </div>
        <span className="badge badge-low">Qdrant Indexed</span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: "1.25rem",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}>
        {messages.length === 0 ? (
          <div style={{
            margin: "auto",
            textAlign: "center",
            color: "var(--text-secondary)",
            maxWidth: "360px",
          }}>
            <Bot size={36} color="var(--accent-indigo)" style={{ margin: "0 auto 0.75rem", opacity: 0.8 }} />
            <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.25rem" }}>Ask Any Legal Question</h4>
            <p style={{ fontSize: "0.8rem" }}>
              Upload a document or select a quick action above to begin grounded legal analysis with clause citations.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id || Math.random()}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                backgroundColor: m.role === "user" ? "var(--accent-indigo)" : "rgba(255, 255, 255, 0.04)",
                border: m.role === "user" ? "none" : "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem", fontSize: "0.75rem", color: m.role === "user" ? "rgba(255, 255, 255, 0.8)" : "var(--text-secondary)" }}>
                {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
                <span>{m.role === "user" ? "You" : "Legal AI Assistant"}</span>
              </div>
              <p style={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>{m.content}</p>
              {m.citations && m.citations.length > 0 && (
                <div style={{ marginTop: "0.5rem", paddingTop: "0.4rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.75rem", color: "var(--accent-gold)" }}>
                  <BookOpen size={12} style={{ display: "inline", marginRight: "4px" }} />
                  Grounded Citation: Clause 12 (Page 4)
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: "var(--text-secondary)", fontSize: "0.85rem", padding: "0.5rem" }}>
            Analyzing legal context & generating response...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "1rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          gap: "0.75rem",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <input
          id="chat-query-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about termination, liabilities, or Indian law..."
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "0.625rem 1rem",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <Button type="submit" id="btn-chat-send" icon={Send}>
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatPanel;
