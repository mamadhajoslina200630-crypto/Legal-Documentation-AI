import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function VoicePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVoice = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      id="btn-voice-assistant-player"
      onClick={toggleVoice}
      className={`btn ${isPlaying ? "btn-primary" : "btn-secondary"}`}
      style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
      title="Listen to Plain Language Legal Summary (TTS)"
    >
      {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
      {isPlaying ? "Stop Voice" : "Voice Readout"}
    </button>
  );
}

export default VoicePlayer;
