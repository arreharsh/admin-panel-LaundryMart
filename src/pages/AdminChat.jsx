import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://laundrymart.onrender.com', {
  transports: ['websocket'],
});

const AdminChat = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminId] = useState('admin123'); // Can be dynamic later
  const [text, setText] = useState('');

  // 🔔 Listen for new user chat requests
  useEffect(() => {
    socket.on('adminNotification', ({ userId }) => {
      if (!pendingUsers.includes(userId)) {
        setPendingUsers((prev) => [...prev, userId]);
      }
    });

    return () => socket.off('adminNotification');
  }, [pendingUsers]);

  // 💬 Listen for messages from user
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (
        (msg.sender === selectedUser && msg.receiver === adminId) ||
        (msg.sender === adminId && msg.receiver === selectedUser)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [selectedUser, adminId]);

  // 🔁 Auto scroll
  useEffect(() => {
    const chatBox = document.querySelector('.chat-scroll');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() && selectedUser) {
      socket.emit('adminReply', {
        adminId,
        userId: selectedUser,
        message: text.trim(),
      });
      setText('');
    }
  };

  const selectUser = (userId) => {
    setSelectedUser(userId);
    setMessages([]); // reset chat
    socket.emit('adminConnectUser', { userId });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">👥 Pending Users</h2>
        {pendingUsers.length === 0 && (
          <p className="text-gray-500">No new requests.</p>
        )}
        {pendingUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => selectUser(user)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              user === selectedUser
                ? 'bg-blue-200'
                : 'bg-white hover:bg-blue-50'
            }`}
          >
            {user}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white chat-scroll">
          {selectedUser ? (
            messages.map((msg, index) => {
              const isAdmin = msg.sender === adminId;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-[70%] ${
                    isAdmin
                      ? 'self-end bg-green-100 text-right rounded-br-none'
                      : 'self-start bg-gray-200 text-left rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">Select a user to start chat</p>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="p-4 border-t flex bg-white">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 mr-2"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
