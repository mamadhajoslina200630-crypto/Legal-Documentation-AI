import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useDocumentContext } from "../context/DocumentContext";
import { translations } from "../context/translations";

export default function TextToSpeech({ messageId, textToRead }) {
  const { speakingMessageId, handleToggleSpeech, language } = useDocumentContext();
  const t = translations[language] || translations.en;

  const isSpeaking = speakingMessageId === messageId;

  return (
    <button
      onClick={() => handleToggleSpeech(messageId, textToRead)}
      className={`btn-tts ${isSpeaking ? "speaking" : ""}`}
      title={isSpeaking ? t.stopReading : t.readAloud}
      aria-label="Text-to-Speech"
    >
      {isSpeaking ? (
        <>
          <div className="audio-waves" aria-hidden="true">
            <span className="audio-bar"></span>
            <span className="audio-bar"></span>
            <span className="audio-bar"></span>
            <span className="audio-bar"></span>
          </div>
          <VolumeX size={13} />
        </>
      ) : (
        <Volume2 size={13} />
      )}
    </button>
  );
}
