import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  FileText,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Scale,
  Globe,
  Search,
  ShieldAlert,
  Clock,
  BookOpen,
  ArrowUp,
  AlertTriangle,
  Loader2,
  UploadCloud,
} from "lucide-react";
import api from "../../api/client";
import { useDocumentContext } from "../../context/DocumentContext";

// 8 Legal Services Definition
const LEGAL_SERVICES = [
  {
    id: "summary",
    title: "Document Summary",
    desc: "Executive summary, parties & key findings",
    icon: FileText,
    prompt: "Provide a comprehensive legal summary of this document.",
  },
  {
    id: "translation",
    title: "Regional Translation",
    desc: "Hindi / regional language translation",
    icon: Globe,
    prompt: "Provide a regional language translation of the core operative terms.",
  },
  {
    id: "key_info",
    title: "Key Information",
    desc: "Parties, dates, financial amounts & relief",
    icon: Search,
    prompt: "Extract contracting parties, effective dates, total amounts, and governing law.",
  },
  {
    id: "clauses",
    title: "Clauses & Grounds",
    desc: "Statutory provisions, indemnity & terms",
    icon: Scale,
    prompt: "Extract and classify the main legal clauses and statutory grounds.",
  },
  {
    id: "risks",
    title: "Risk Detection",
    desc: "Unfavorable terms, liabilities & exposures",
    icon: AlertTriangle,
    prompt: "Identify legal risks, punitive liabilities, and unfavorable provisions.",
  },
  {
    id: "compliance",
    title: "Compliance Check",
    desc: "Indian statutes (DPDP, Contract, Family Law)",
    icon: CheckCircle2,
    prompt: "Assess statutory compliance under applicable Indian laws.",
  },
  {
    id: "obligations",
    title: "Obligations & Deadlines",
    desc: "Filing dates, notice periods & schedules",
    icon: Clock,
    prompt: "Extract all contractual obligations, deadlines, and milestone dates.",
  },
  {
    id: "simple_explanation",
    title: "Plain-Language",
    desc: "Jargon-free explanation for citizens",
    icon: BookOpen,
    prompt: "Explain this document in simple, everyday layman terms.",
  },
];

export function AIWorkspacePage() {
  const { activeDocument, setActiveDocument } = useDocumentContext();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Listen to Sidebar events
  useEffect(() => {
    const handleNewChat = () => {
      setMessages([]);
      setActiveDocument(null);
      setConversationId(`conv-${Date.now()}`);
      setInputText("");
    };

    const handleLoadConversation = (e) => {
      const conv = e.detail;
      setConversationId(conv.id);
      // Fetch message history for selected conversation
      api.get(`/chat/conversations/${conv.id}/history`)
        .then((history) => {
          if (Array.isArray(history)) {
            setMessages(
              history.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                citations: m.citations ? (typeof m.citations === "string" ? JSON.parse(m.citations) : m.citations) : [],
              }))
            );
          }
        })
        .catch(() => {});
    };

    window.addEventListener("start-new-chat", handleNewChat);
    window.addEventListener("load-conversation", handleLoadConversation);
    return () => {
      window.removeEventListener("start-new-chat", handleNewChat);
      window.removeEventListener("load-conversation", handleLoadConversation);
    };
  }, []);

  // Handle Document Upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/documents/upload", formData);
      setActiveDocument(res);

      // Notify sidebar of new conversation workspace
      window.dispatchEvent(new CustomEvent("conversations-updated"));

      // 1. Add user upload card to chat
      const userUploadMsg = {
        id: `upload-${Date.now()}`,
        role: "user",
        type: "file_upload",
        fileInfo: {
          name: res.filename || file.name,
          size: file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Uploaded",
          id: res.id,
        },
      };

      // 2. Add assistant response with 8 services grid
      const assistantServiceMenuMsg = {
        id: `menu-${Date.now()}`,
        role: "assistant",
        type: "service_menu",
        content: `I've analyzed and indexed **${res.filename || file.name}**. Select a legal service below to get an instant analysis, or type your question:`,
        docId: res.id,
      };

      setMessages((prev) => [...prev, userUploadMsg, assistantServiceMenuMsg]);
    } catch (err) {
      console.error("Upload error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "❌ Failed to upload document. Please ensure the backend server is running and try again.",
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  // Handle Service Selection (Clicking one of the 8 options)
  const handleServiceSelect = async (service) => {
    const userMsg = {
      id: `user-opt-${Date.now()}`,
      role: "user",
      content: service.prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post("/chat/ask", {
        conversation_id: conversationId,
        question: service.id,
        document_id: activeDocument?.id,
        document_name: activeDocument?.filename || activeDocument?.name,
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.answer,
        citations: res.citations || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Service request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Unable to retrieve response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Direct Chat Submission
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const query = inputText.trim();
    setInputText("");

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post("/chat/ask", {
        conversation_id: conversationId,
        question: query,
        document_id: activeDocument?.id,
        document_name: activeDocument?.filename || activeDocument?.name,
      });

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.answer,
        citations: res.citations || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an issue processing that query.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "var(--bg-canvas)",
        position: "relative",
      }}
    >
      {/* Hidden File Input for Paperclip Attachment */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.docx,.txt,.doc,.png,.jpg"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      {/* Main Conversation Canvas */}
      <div
        className="chat-thread-container"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
        }}
      >
        {messages.length === 0 ? (
          /* Empty State: ChatGPT Hero Greeting */
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
              maxWidth: "520px",
              padding: "2rem 1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#10a37f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(16, 163, 127, 0.3)",
              }}
            >
              <Scale size={26} color="#ffffff" />
            </div>

            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                What legal document can I help with?
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                Upload agreements, divorce petitions, or court orders to begin instant legal analysis and regional translation.
              </p>
            </div>

            {/* Prominent Upload Card in Center */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "2rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "2px dashed var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--text-primary)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={32} color="#10a37f" className="animate-spin" />
                  <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "var(--text-primary)" }}>
                    Ingesting & indexing legal document...
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud size={32} color="#10a37f" />
                  <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-primary)" }}>
                    Attach Document to Start
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    PDF, DOCX, or Scanned Petitions (e.g. vaj divorce.pdf)
                  </span>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Active Chat Feed */
          messages.map((m, idx) => (
            <div key={m.id || idx} className={`chat-message-row ${m.role}`}>
              {m.role === "user" ? (
                /* User Bubble */
                m.type === "file_upload" ? (
                  <div className="uploaded-file-chip">
                    <FileText size={20} color="#10a37f" />
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-primary)" }}>
                        {m.fileInfo?.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {m.fileInfo?.size} • Verified & Indexed
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-bubble-user">{m.content}</div>
                )
              ) : (
                /* Assistant Message */
                <div className="chat-bubble-assistant">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#10a37f",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Scale size={14} color="#ffffff" />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      Legal AI
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="markdown-body" style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", lineHeight: "1.7" }}>
                    {m.content}
                  </div>

                  {/* If this is the Service Menu, render the 8 Options Grid */}
                  {m.type === "service_menu" && (
                    <div className="service-options-grid">
                      {LEGAL_SERVICES.map((s) => {
                        const Icon = s.icon;
                        return (
                          <div
                            key={s.id}
                            className="service-option-card"
                            onClick={() => handleServiceSelect(s)}
                            id={`btn-service-${s.id}`}
                          >
                            <div className="service-card-icon">
                              <Icon size={18} color="#10a37f" />
                            </div>
                            <div style={{ overflow: "hidden" }}>
                              <div className="service-card-title">{s.title}</div>
                              <div className="service-card-desc">{s.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions / Copy button for standard responses */}
                  {m.content && m.type !== "service_menu" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
                      <button
                        onClick={() => handleCopy(m.content, idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.8rem",
                          padding: "0.2rem 0.4rem",
                          borderRadius: "var(--radius-sm)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                      >
                        {copiedIndex === idx ? <Check size={14} color="#10a37f" /> : <Copy size={14} />}
                        <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="chat-message-row assistant">
            <div className="chat-bubble-assistant" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
              <Loader2 size={16} className="animate-spin" color="#10a37f" />
              <span>Analyzing legal provisions & preparing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating ChatGPT Input Bar */}
      <div className="chat-input-wrapper">
        <form onSubmit={handleSendMessage} className="chat-input-box">
          {/* Attachment Clip Button */}
          <button
            type="button"
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach legal document (PDF, DOCX, etc.)"
            id="btn-attachment-clip"
          >
            <Paperclip size={19} />
          </button>

          {/* Text Input */}
          <textarea
            className="chat-textarea"
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              activeDocument
                ? `Ask about ${activeDocument.filename}...`
                : "Upload a document or ask a legal question..."
            }
          />

          {/* Send Arrow Button */}
          <button
            type="submit"
            className={`input-icon-btn ${inputText.trim() ? "send-active" : ""}`}
            disabled={!inputText.trim() || loading}
            id="btn-chat-send"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Legal AI Simplifier • Always verify statutory citations with an advocate.
        </div>
      </div>
    </div>
  );
}

export default AIWorkspacePage;
