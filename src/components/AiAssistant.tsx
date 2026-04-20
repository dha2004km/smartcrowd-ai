"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I am your SmartCrowd AI assistant. How can I help you manage the stadium today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: data.response }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: "Error: " + (data.error || "Failed to communicate with AI.") }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: "Error: Network issue or server unavailable." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card ai-assistant">
      <div className="ai-header">
        <h3>SmartCrowd Assistant</h3>
        <div className="status-indicator status-good"></div>
      </div>
      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.role}`}>
            <div className={`message bubble-${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper assistant">
            <div className="message bubble-assistant loading-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="ai-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for recommendations (e.g., 'How to clear Gate C?')"
          disabled={loading}
          maxLength={500}
        />
        <button type="submit" className="primary-btn ai-submit-btn" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
