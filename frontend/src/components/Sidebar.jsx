import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Scale,
  PanelLeftClose,
  PanelLeft,
  User,
  Clock
} from "lucide-react";
import api from "../api/client";
import { useDocumentContext } from "../context/DocumentContext";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    setActiveDocument,
    setActiveCitation,
    setIsDocViewerOpen,
    conversations,
    setConversations,
    selectedLanguage
  } = useDocumentContext();

  const handleNewChat = () => {
    setActiveDocument(null);
    setActiveCitation(null);
    setIsDocViewerOpen(false);
    window.dispatchEvent(new CustomEvent("start-new-chat"));
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${convId}`);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
    } catch (err) {
      setConversations((prev) => prev.filter((c) => c.id !== convId));
    }
  };

  const handleSelectConversation = (conv) => {
    window.dispatchEvent(new CustomEvent("load-conversation", { detail: conv }));
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
          title="New Chat"
        >
          <Plus size={18} />
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
          <span className="brand-text">Legal<span className="brand-gradient-txt">AI</span></span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="sidebar-collapse-btn"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={17} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="sidebar-new-chat-container">
        <button
          id="btn-new-chat-sidebar"
          onClick={handleNewChat}
          className="sidebar-new-chat-btn"
        >
          <Plus size={16} color="#3B82F6" />
          <span>{selectedLanguage === "ta" ? "புதிய உரையாடல்" : "New Chat"}</span>
        </button>
      </div>

      {/* Chat History Memories */}
      <div className="sidebar-scrollable-body">
        <div className="sidebar-section-heading">
          <Clock size={12} />
          <span>{selectedLanguage === "ta" ? "முந்தைய உரையாடல்கள்" : "Chat History"}</span>
        </div>

        <div className="sidebar-conversations-list">
          {conversations.length === 0 ? (
            <div className="sidebar-empty-chat-hint">
              {selectedLanguage === "ta"
                ? "சேமிக்கப்பட்ட உரையாடல்கள் இல்லை. ஆவணத்தை பதிவேற்றி தொடங்கவும்."
                : "No chat history yet. Upload a document to begin."}
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c)}
                className="sidebar-conv-item"
              >
                <MessageSquare size={13} color="var(--text-secondary)" />
                <span className="conv-title">{c.title || "Legal Consultation"}</span>
                <button
                  className="conv-del-btn"
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  title="Delete memory"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="sidebar-footer-profile">
        <div className="user-avatar-circle">
          <User size={15} color="#ffffff" />
        </div>
        <div className="user-text-info">
          <div className="user-name-title">Advocate / Legal Counsel</div>
          <div className="user-tier-badge">
            <span className="tier-dot"></span> Legal AI Pro
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
