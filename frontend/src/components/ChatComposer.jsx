import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, MicOff, ArrowUp, Send } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function ChatComposer() {
  const { runServiceAction, uploadDocument, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputVal]);

  // Voice Speech Recognition setup
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback simulation if browser doesn't have Web Speech API
      if (isListening) {
        setIsListening(false);
      } else {
        setIsListening(true);
        setTimeout(() => {
          setInputVal((prev) =>
            prev
              ? `${prev} Are there any high risk liability clauses?`
              : "Are there any high risk liability clauses?"
          );
          setIsListening(false);
        }, 2200);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "ta" ? "ta-IN" : "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputVal(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error", err);
      setIsListening(false);
    }
  };

  const handleSend = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    runServiceAction(null, trimmed);
    setInputVal("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadDocument(files[0]);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="chat-composer-container">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
      />

      <div className="composer-box">
        {/* Attachment Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="composer-btn"
          title="Upload document (PDF, DOCX, TXT)"
          aria-label="Upload document"
        >
          <Paperclip size={17} />
        </button>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? t.recording : t.askPlaceholder}
          className="composer-input"
          rows={1}
          aria-label="Message input"
        />

        {/* Action controls: Mic + Send */}
        <div className="composer-actions">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`composer-btn ${isListening ? "listening" : ""}`}
            title={isListening ? "Stop listening" : "Voice input"}
            aria-label="Voice input"
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className={`btn-send ${inputVal.trim() ? "active" : ""}`}
            title={t.send}
            aria-label={t.send}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
