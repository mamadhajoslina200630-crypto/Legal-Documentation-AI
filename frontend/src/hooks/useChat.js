import { useState } from "react";
import api from "../api/client";

export function useChat(initialConversationId = null) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (question, documentId = null) => {
    if (!question.trim()) return;

    const userMsg = { role: "user", content: question, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/chat/ask", {
        conversation_id: conversationId || "default-conv",
        question,
        document_id: documentId,
      });

      const assistantMsg = {
        role: "assistant",
        content: res.answer,
        citations: res.citations || [],
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (res.conversation_id) setConversationId(res.conversation_id);
      return res;
    } catch (err) {
      setError(err);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    conversationId,
    messages,
    loading,
    error,
    sendMessage,
    setMessages,
  };
}
