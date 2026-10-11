import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';

export const CHIPS = [
  'How much should I save this week?',
  'My income was lower this month. What should I prioritise?',
  'How do I build an emergency fund?',
  'How much should I set aside for vehicle maintenance?',
  'Explain an EMI in simple terms',
];

export default function Ask() {
  const { getAssistantAnswer } = useData();
  const [messages, setMessages] = useState([
    { text: 'Hi! Ask me about saving, budgeting, emergency funds or EMIs.', isMe: false },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (question) => {
    const q = (question || inputVal).trim();
    if (!q) return;

    // Add user question
    const answer = getAssistantAnswer(q);
    setMessages((prev) => [
      ...prev,
      { text: q, isMe: true },
      { text: answer, isMe: false },
    ]);
    setInputVal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="w pg au" style={{ maxWidth: '720px' }}>
      <h2>Ask SHIFT</h2>
      <p>General educational information only. Not financial advice, and no guaranteed outcomes.</p>

      {/* Chat Messages Card */}
      <div className="card mt" style={{ minHeight: '320px', maxHeight: '480px', overflowY: 'auto' }}>
        <div>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.isMe ? 'me' : ''}`}>
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Question Chips */}
      <div className="row mt">
        {CHIPS.map((chip, i) => (
          <button
            key={i}
            type="button"
            className="btn ghost sm"
            onClick={() => handleSend(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="row mt" style={{ flexWrap: 'nowrap' }}>
        <input
          name="q"
          placeholder="Type your question"
          style={{ margin: 0 }}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button className="btn">Ask</button>
      </form>
    </div>
  );
}
