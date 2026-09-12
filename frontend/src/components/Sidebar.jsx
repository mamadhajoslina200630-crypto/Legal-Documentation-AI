import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Trash2,
  Scale,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  FileText,
  GitCompare,
  Edit3,
  User,
} from "lucide-react";
import api from "../api/client";
import { useDocumentContext } from "../context/DocumentContext";

export function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeDocument, setActiveDocument } = useDocumentContext();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchConversations = () => {
    api.get("/chat/conversations")
      .then((data) => {
        if (Array.isArray(data)) setConversations(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchConversations();
    // Listen for custom conversation update events
    window.addEventListener("conversations-updated", fetchConversations);
    return () => window.removeEventListener("conversations-updated", fetchConversations);
  }, []);

  const handleNewChat = () => {
    setActiveDocument(null);
    navigate("/");
    window.dispatchEvent(new CustomEvent("start-new-chat"));
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${convId}`);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeDocument?.conversation_id === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Delete conversation failed:", err);
    }
  };

  const handleSelectConversation = (conv) => {
    navigate("/");
    window.dispatchEvent(new CustomEvent("load-conversation", { detail: conv }));
  };

  if (isCollapsed) {
    return (
      <aside
        style={{
          width: "52px",
          backgroundColor: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0.75rem 0",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="input-icon-btn"
          title="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <button
          onClick={handleNewChat}
          className="input-icon-btn"
          title="New chat"
        >
          <Plus size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      id="chatgpt-sidebar"
      style={{
        width: "260px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0.6rem 0.6rem 0.75rem 0.6rem",
        userSelect: "none",
        zIndex: 50,
      }}
    >
      {/* Top Header: Brand + Collapse Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.3rem 0.5rem 0.6rem 0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#10a37f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Scale size={16} color="#ffffff" />
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#ffffff" }}>
            Legal AI
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="input-icon-btn"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* New Chat Button (ChatGPT Style) */}
      <div style={{ padding: "0.25rem 0 0.75rem 0" }}>
        <button
          id="btn-new-chat-sidebar"
          onClick={handleNewChat}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Plus size={16} />
          <span>New Workspace / Chat</span>
        </button>
      </div>

      {/* Conversations / Workspaces List */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.5rem 0.6rem 0.25rem 0.6rem", fontWeight: "600" }}>
          Recent Workspaces
        </div>

        {conversations.length === 0 ? (
          <div style={{ padding: "0.75rem 0.6rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            No chat history yet. Upload a document to begin.
          </div>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectConversation(c)}
              className="chat-sidebar-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.65rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)";
                const del = e.currentTarget.querySelector(".del-btn");
                if (del) del.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                const del = e.currentTarget.querySelector(".del-btn");
                if (del) del.style.opacity = "0";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <MessageSquare size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.title || "Untitled Workspace"}
                </span>
              </div>
              <button
                className="del-btn"
                onClick={(e) => handleDeleteConversation(e, c.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.15s ease",
                  padding: "2px",
                }}
                title="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}

        {/* Secondary Tools Menu */}
        <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0 0.6rem 0.25rem 0.6rem", fontWeight: "600" }}>
            Tools & Views
          </div>
          <Link
            to="/document"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.45rem 0.65rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.825rem",
              color: location.pathname === "/document" ? "#ffffff" : "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <FileText size={14} /> Document Workspace Tabs
          </Link>
          <Link
            to="/compare"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.45rem 0.65rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.825rem",
              color: location.pathname === "/compare" ? "#ffffff" : "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <GitCompare size={14} /> Redline Compare
          </Link>
          <Link
            to="/draft"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.45rem 0.65rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.825rem",
              color: location.pathname === "/draft" ? "#ffffff" : "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <Edit3 size={14} /> Draft & Rewrite
          </Link>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#2f2f2f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <User size={15} color="var(--text-primary)" />
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-primary)" }}>
            Advocate / Legal User
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--accent-green)" }}>
            Legal AI Pro • Active
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
