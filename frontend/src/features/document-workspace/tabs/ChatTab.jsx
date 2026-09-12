import React from "react";
import ChatPanel from "../../ai-workspace/components/ChatPanel";
import { useChat } from "../../../hooks/useChat";

export function ChatTab({ documentId }) {
  const { messages, loading, sendMessage } = useChat();

  return (
    <div id="tab-content-chat">
      <ChatPanel
        messages={messages}
        loading={loading}
        onSendMessage={(q) => sendMessage(q, documentId)}
      />
    </div>
  );
}

export default ChatTab;
