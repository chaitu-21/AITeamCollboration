import { useState } from 'react';

const AGENT_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/agent/chat`;

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: 'Hello! I am your AI Scrum Master. I monitor the board and can help with triage, standups, or identifying blockers. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(AGENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'agent', text: data.reply }]);
    } catch (err) {
      console.error("Failed to communicate with agent", err);
      setMessages(prev => [...prev, { role: 'agent', text: 'Sorry, I am having trouble connecting to the network right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container">
      <div className="chat-header">
        <div className="agent-icon">AI</div>
        <div>
          <div style={{ fontWeight: 600 }}>Scrum Master AI</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online</div>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message agent loading-dots">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about the project..."
        />
        <button 
          className="send-btn" 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          ➔
        </button>
      </div>
    </div>
  );
}
