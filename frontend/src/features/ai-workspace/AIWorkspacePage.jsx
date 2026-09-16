import React, { useRef, useEffect, useState } from "react";
import {
  Scale,
  UploadCloud,
  FileText,
  Gavel,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileCheck2
} from "lucide-react";
import { useDocumentContext, SAMPLE_DOCUMENTS } from "../../context/DocumentContext";
import { translations } from "../../context/translations";
import ChatHeader from "../../components/ChatHeader";
import ChatMessage from "../../components/ChatMessage";
import ChatComposer from "../../components/ChatComposer";
import DocumentViewer from "../../components/DocumentViewer";
import SettingsModal from "../../components/SettingsModal";
import ProfileModal from "../../components/ProfileModal";

export function AIWorkspacePage() {
  const {
    activeConversation,
    uploadDocument,
    language
  } = useDocumentContext();

  const t = translations[language] || translations.en;
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const messages = activeConversation?.messages || [];
  const hasDocument = !!activeConversation?.document;
  const isSplitOpen = activeConversation?.isSplitViewOpen && hasDocument;

  // Auto scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadDocument(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadDocument(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="main-workspace">
      {/* Top Header */}
      <ChatHeader />

      {/* Hidden Global File Input for Welcome Dropzone */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
      />

      {/* Workspace Content Area: 3-Zone Desktop Layout (Split View / Full Chat) */}
      <div className={`workspace-content ${isSplitOpen ? "split-active" : ""}`}>
        {/* Center / Left Document Viewer (Visible when document is loaded and viewer is open) */}
        {isSplitOpen && <DocumentViewer />}

        {/* Right Chat Pane (Universal Conversational Interface) */}
        <div className="chat-pane" role="region" aria-label="Conversation Workspace">
          <div className="chat-scroll-area">
            <div className="chat-inner-container">
              {/* Screen 1: Welcome & Document Dropzone (NO static 8-service dashboard) */}
              {messages.length === 0 ? (
                <div className="welcome-screen-container">
                  <div className="welcome-hero-header">
                    <div className="welcome-brand-badge">
                      <Scale size={14} color="var(--blue-primary)" />
                      <span>LegalAI Workspace</span>
                    </div>
                    <h1 className="welcome-title">{t.welcomeTitle}</h1>
                    <p className="welcome-subtitle">{t.welcomeSubtitle}</p>
                  </div>

                  {/* Primary Drag & Drop Upload Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`welcome-dropzone ${isDragOver ? "drag-active" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload legal document"
                  >
                    <div className="dropzone-icon-glow">
                      <UploadCloud size={28} color="var(--blue-primary)" />
                    </div>
                    <div className="dropzone-text-group">
                      <span className="dropzone-main-prompt">
                        {t.dropzonePrompt}{" "}
                        <span className="dropzone-highlight">{t.browseFiles}</span>
                      </span>
                      <span className="dropzone-subtext">{t.supportedFormats}</span>
                    </div>
                  </div>

                  {/* Instant Sample Document Starters */}
                  <div className="sample-starter-section">
                    <span className="sample-starter-label">{t.trySampleTitle}</span>
                    <div className="sample-cards-grid">
                      {SAMPLE_DOCUMENTS.map((doc) => {
                        const isJudgment = doc.category === "judgment" || doc.filename.includes("Judgment");
                        return (
                          <div
                            key={doc.id}
                            onClick={() => uploadDocument(doc)}
                            className="sample-card"
                            title={`Load sample ${doc.filename}`}
                          >
                            <div className="sample-card-icon">
                              {isJudgment ? (
                                <Gavel size={16} color="#818CF8" />
                              ) : (
                                <FileText size={16} color="var(--blue-primary)" />
                              )}
                            </div>
                            <div className="sample-card-info">
                              <span className="sample-card-title">{doc.filename.replace(/\.pdf$/, "").replace(/_/g, " ")}</span>
                              <span className="sample-card-desc">
                                {doc.docType} • {doc.totalPages} {t.pages}
                              </span>
                            </div>
                            <ArrowRight size={13} className="sample-arrow" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Conversation Messages (Progressive attachment, AI responses, next-action pills) */
                <>
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Chat Composer at bottom (Universal Interface) */}
          <ChatComposer />
        </div>
      </div>

      {/* Global Modals */}
      <SettingsModal />
      <ProfileModal />
    </div>
  );
}

export default AIWorkspacePage;
