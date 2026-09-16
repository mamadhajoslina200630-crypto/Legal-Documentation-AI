import React, { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Settings,
  User,
  Scale,
  X,
  FileText,
  Gavel,
  FolderClosed
} from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Sidebar() {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    selectConversation,
    createNewChat,
    openDocument,
    deleteConversation,
    language,
    setIsSettingsOpen,
    setIsProfileOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    SAMPLE_DOCUMENTS
  } = useDocumentContext();

  const t = translations[language] || translations.en;
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations by search term
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations: Today, Yesterday, Previous 7 Days, Older
  const groups = [
    { key: "today", label: t.today, items: filtered.filter((c) => c.timeCategory === "today") },
    { key: "yesterday", label: t.yesterday, items: filtered.filter((c) => c.timeCategory === "yesterday") },
    { key: "previous7Days", label: t.previous7Days, items: filtered.filter((c) => c.timeCategory === "previous7Days") },
    { key: "older", label: t.older, items: filtered.filter((c) => c.timeCategory === "older") }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? "mobile-open" : ""}`} role="navigation">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand-logo">
              <span className="brand-dot" aria-hidden="true"></span>
              <span>{t.brand}</span>
            </div>
            {isMobileSidebarOpen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="history-delete-btn"
                style={{ opacity: 1 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <span className="brand-tagline">{t.tagline}</span>

          {/* + New Chat Action */}
          <button
            onClick={createNewChat}
            className="btn-new-chat"
            title="Start a new legal conversation"
          >
            <Plus size={15} className="plus-icon" />
            <span>{t.newChat}</span>
          </button>

          {/* Search Bar */}
          <div className="sidebar-search">
            <Search size={13} className="sidebar-search-icon" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
        </div>

        {/* Documents Shelf (Section 2 of ui_look.md) */}
        <div className="sidebar-docs-section">
          <div className="sidebar-section-title">
            <FolderClosed size={12} color="var(--blue-primary)" />
            <span>{language === "ta" ? "ஆவணங்கள்" : "Documents"}</span>
          </div>
          <div className="sidebar-docs-list">
            {SAMPLE_DOCUMENTS.map((doc) => {
              const isSelected = activeConversation?.document?.id === doc.id;
              const isJudg = doc.category === "judgment";
              return (
                <button
                  key={doc.id}
                  onClick={() => openDocument(doc.id)}
                  className={`sidebar-doc-card ${isSelected ? "active" : ""}`}
                  title={doc.filename}
                >
                  <div className="doc-card-icon">
                    {isJudg ? <Gavel size={13} color="#818CF8" /> : <FileText size={13} color="var(--blue-primary)" />}
                  </div>
                  <div className="doc-card-content">
                    <span className="doc-card-title">{doc.filename.replace(/\.pdf$/, "").replace(/_/g, " ")}</span>
                    <span className="doc-card-meta">{doc.totalPages} {t.pages}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* History / Memory Section */}
        <div className="sidebar-history">
          <div className="sidebar-section-title" style={{ padding: "0 4px" }}>
            <MessageSquare size={12} />
            <span>{language === "ta" ? "உரையாடல் வரலாறு" : "History"}</span>
          </div>

          {groups.map((grp) => {
            if (grp.items.length === 0) return null;
            return (
              <div key={grp.key} className="history-group">
                <div className="history-group-title">{grp.label}</div>
                <div className="history-items">
                  {grp.items.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => selectConversation(conv.id)}
                        className={`history-item ${isActive ? "active" : ""}`}
                        title={conv.title}
                      >
                        <div className="history-item-content">
                          <MessageSquare size={13} style={{ flexShrink: 0 }} />
                          <span className="history-item-title">{conv.title}</span>
                        </div>
                        <button
                          onClick={(e) => deleteConversation(conv.id, e)}
                          className="history-delete-btn"
                          title="Delete conversation"
                        >
                          <Trash2 size={12} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* User Profile Summary */}
          <div
            className="user-profile-row"
            onClick={() => setIsProfileOpen(true)}
            title="View legal practitioner credentials"
          >
            <div className="user-avatar">RK</div>
            <div className="user-info">
              <span className="user-name">{t.profileModal.name}</span>
              <span className="user-role">{t.profileModal.org}</span>
            </div>
          </div>

          {/* Bottom Actions: Language Switcher + Settings */}
          <div className="footer-nav-row">
            <LanguageSwitcher />

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="footer-btn"
              title={t.settings}
            >
              <Settings size={14} />
              <span>{t.settings}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
