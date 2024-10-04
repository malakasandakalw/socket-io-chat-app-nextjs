
'use client'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const id = '1'
const socket = io('http://localhost:3001', {
  query: { userId: id }
});

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ id: string, text: string }[]>([]);

  useEffect(() => {

    socket.on('chat-history', (chatHistory) => {
      console.log(chatHistory)
      setMessages(chatHistory);
    });

    socket.on('new-message', (newMessage) => {
      toast.success(`new message ${newMessage.text}`);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('chat-history');
      socket.off('new-message');
    };
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('new-message', {message, userId: id});
      setMessage('');
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.id}</strong>: {msg.text}
          </div>
        ))}
      </div>

    </div>
  );
}
