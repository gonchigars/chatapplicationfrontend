import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const apiUrl = "http://localhost:8080/api/chat";

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (sender && content) {
      await fetch(`${apiUrl}/send?sender=${sender}&content=${content}`, {
        method: "POST",
      });
      setContent(""); // Clear the message input after sending
      fetchMessages(); // Fetch the latest messages
    }
  };

  return (
    <div id="chat-container">
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender}: {msg.content} (
            {new Date(msg.timestamp).toLocaleTimeString()})
          </div>
        ))}
      </div>
      <input
        type="text"
        id="sender"
        placeholder="Your Name"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />
      <input
        type="text"
        id="content"
        placeholder="Your Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button id="send-btn" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
}

export default App;
