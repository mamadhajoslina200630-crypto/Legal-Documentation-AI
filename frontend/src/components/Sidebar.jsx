import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Trash2,
  Scale,
  PanelLeftClose,
  PanelLeft,
  FileText,
  GitCompare,
  Edit3,
  User,
  BookOpen,
  FolderOpen,
  Sparkles,
  Gavel
} from "lucide-react";
import api from "../api/client";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../context/DocumentContext";

export function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    activeDocument,
    setActiveDocument,
    documentsList,
    setDocumentsList,
    setViewMode
  } = useDocumentContext();

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
    window.addEventListener("conversations-updated", fetchConversations);
    return () => window.removeEventListener("conversations-updated", fetchConversations);
  }, []);

  const handleNewChat = () => {
    setActiveDocument(SAMPLE_DOCUMENTS[0]);
    navigate("/");
    window.dispatchEvent(new CustomEvent("start-new-chat"));
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${convId}`);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
    } catch (err) {
      console.error("Delete conversation failed:", err);
    }
  };

  const handleSelectConversation = (conv) => {
    navigate("/");
    window.dispatchEvent(new CustomEvent("load-conversation", { detail: conv }));
  };

  const handleSelectDocument = (doc) => {
    setActiveDocument(doc);
    setViewMode("split");
    navigate("/");
  };

  if (isCollapsed) {
    return (
      <aside className="chatgpt-sidebar-collapsed">
        <button
          onClick={() => setIsCollapsed(false)}
          className="sidebar-icon-toggle-btn"
          title="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <button
          onClick={handleNewChat}
          className="sidebar-icon-toggle-btn"
          title="New chat / workspace"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => setActiveDocument(SAMPLE_DOCUMENTS[0])}
          className="sidebar-icon-toggle-btn"
          title="Open Contract"
        >
          <FileText size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside id="chatgpt-sidebar" className="chatgpt-sidebar-expanded">
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="sidebar-brand-title">
          <div className="sidebar-logo-icon">
            <Scale size={16} color="#ffffff" />
          </div>
          <span className="brand-text">Legal AI</span>
          <span className="brand-version-badge">v2.0</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="sidebar-collapse-btn"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={17} />
        </button>
      </div>

      {/* New Workspace / Chat Button */}
      <div className="sidebar-new-chat-container">
        <button
          id="btn-new-chat-sidebar"
          onClick={handleNewChat}
          className="sidebar-new-chat-btn"
        >
          <Plus size={16} color="#10a37f" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Main Sidebar Scroll Area */}
      <div className="sidebar-scrollable-body">
        {/* DOCUMENTS SECTION (as mandated by ui_look.md) */}
        <div className="sidebar-section-heading">
          <FolderOpen size={12} />
          <span>Documents</span>
        </div>

        <div className="sidebar-documents-list">
          {documentsList.map((doc) => {
            const isActive = activeDocument?.id === doc.id;
            const isJudgment = doc.docType?.toLowerCase().includes("judgment") ||
              doc.filename.toLowerCase().includes("judgment");

            return (
              <div
                key={doc.id}
                onClick={() => handleSelectDocument(doc)}
                className={`sidebar-doc-item ${isActive ? "active" : ""}`}
                title={doc.filename}
              >
                <div className="sidebar-doc-icon">
                  {isJudgment ? <Gavel size={14} color="#f59e0b" /> : <FileText size={14} color="#10a37f" />}
                </div>
                <div className="sidebar-doc-info">
                  <span className="doc-name">{doc.filename}</span>
                  <span className="doc-meta-sub">
                    {doc.totalPages || 14} pgs · {isJudgment ? "Judgment" : "Agreement"}
                  </span>
                </div>
                {isActive && <span className="doc-active-indicator"></span>}
              </div>
            );
          })}
        </div>

        {/* WORKSPACES & HISTORY SECTION */}
        <div className="sidebar-section-heading" style={{ marginTop: "1.25rem" }}>
          <MessageSquare size={12} />
          <span>History & Chats</span>
        </div>

        <div className="sidebar-conversations-list">
          {conversations.length === 0 ? (
            <div className="sidebar-empty-chat-hint">
              Active workspace ready. Upload or select a document to begin.
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c)}
                className="sidebar-conv-item"
              >
                <MessageSquare size={13} color="var(--text-secondary)" />
                <span className="conv-title">{c.title || "Document Analysis"}</span>
                <button
                  className="conv-del-btn"
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  title="Delete chat"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* SECONDARY LEGAL TOOLS (Redline, Compare, Draft) */}
        <div className="sidebar-section-heading" style={{ marginTop: "1.25rem" }}>
          <span>Additional Tools</span>
        </div>
        <div className="sidebar-links-list">
          <Link
            to="/document"
            className={`sidebar-nav-link ${location.pathname === "/document" ? "active" : ""}`}
          >
            <BookOpen size={14} /> Tabs Breakdown
          </Link>
          <Link
            to="/compare"
            className={`sidebar-nav-link ${location.pathname === "/compare" ? "active" : ""}`}
          >
            <GitCompare size={14} /> Redline Compare
          </Link>
          <Link
            to="/draft"
            className={`sidebar-nav-link ${location.pathname === "/draft" ? "active" : ""}`}
          >
            <Edit3 size={14} /> Clause Drafter
          </Link>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="sidebar-footer-profile">
        <div className="user-avatar-circle">
          <User size={15} color="#ffffff" />
        </div>
        <div className="user-text-info">
          <div className="user-name-title">Advocate / Legal Counsel</div>
          <div className="user-tier-badge">
            <span className="tier-dot"></span> Indian Legal Intelligence Pro
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
