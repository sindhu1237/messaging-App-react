import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udeltzoxxkcxtrdlbsbp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjgwMDI0MDMwLCJzdWIiOiJhMWE3NzlmNS00YmY3LTQyMDAtODBiYS1kMzgxZDNiNGM4MmQiLCJlbWFpbCI6InNpbmRodS5ydWRyYWJvaW5hQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZ2l0aHViIiwiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNjc5OTgwOTc4fV0sInNlc3Npb25faWQiOiJmMTJjYzJiNi00M2NiLTRkOWMtODMyMy00NWExMmE1MzM4ZDUifQ.s3eXzl1O_r4vLb4n0BCA8qOYWfQwa21-UwX24NAODHk';

export const supabase = createClient(supabaseUrl, supabaseKey);
import { useEffect, useState } from 'react';

import { FaPaperPlane } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        console.log(error);
      } else {
        setMessages(messages);
      }
    };
    fetchMessages();

    const messageListener = supabase
      .from('messages')
      .on('INSERT', payload => {
        setMessages([payload.new, ...messages]);
      })
      .subscribe();
    return () => {
      messageListener.unsubscribe();
    };
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage) {
      return;
    }
    const { error } = await supabase.from('messages').insert({ message: newMessage });
    if (error) {
      console.log(error);
      toast.error('Error sending message');
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
