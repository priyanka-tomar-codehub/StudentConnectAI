import {useState,useEffect} from "react";
import socket from "../../services/socket.js";
import axios from "axios";
import "./ChatConnection.css";

const ChatConnection = ({ chatId }) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [chatPartner, setChatPartner] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

useEffect(() => {
    
    const handleConnect = () => {
        setConnected(true);
        setError("");
        console.log("Socket connected:", socket.id);
    };
    const handleDisconnect = () => {
        setConnected(false);
        console.log("Socket disconnected");
    };
    const handleConnectError = (err) => {
        setConnected(false);
        setError(err.message);
        console.error("Socket connection error:", err.message);
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.disconnect();
    };
}, []);

useEffect(() => {
  if (!connected || !chatId) return;

  const handleJoinedChat = (data) => {
    console.log("Joined chat:", data);
  };

  const handleChatError = (message) => {
    console.log("Chat error:", message);
  };

  socket.on("joinedChat", handleJoinedChat);
  socket.on("chatError", handleChatError);

  socket.emit("joinChat", chatId);

  return () => {
    socket.off("joinedChat", handleJoinedChat);
    socket.off("chatError", handleChatError);
  };
}, [connected, chatId]);

useEffect(() => {

    const handleNewMessage = (message) => {

        console.log("New message received:", message);

        setMessages((prevMessages) => {
            const alreadyExists = prevMessages.some(
      (msg) => msg._id === message._id
    );
        if (alreadyExists) return prevMessages;

    return [...prevMessages, message];
  });
};

    socket.on("newMessage", handleNewMessage);

    return () => {
        socket.off("newMessage", handleNewMessage);
    };

}, []);



const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/chats/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages(response.data.messages);

  } catch (error) {
    console.log("Fetch messages error:", error.response?.data || error.message);
  }
};

useEffect(() => {
  if (chatId) {
    fetchMessages();
  }
}, [chatId]);

const sendMessage = () => {
     console.log("Send clicked", {
  messageInput,
  chatId,
  connected
});


    if (!messageInput.trim() || !chatId || !connected) {
        return;
    }
    console.log("Emitting message:", messageInput.trim());

    socket.emit("sendMessage", {
        chatId,
        content: messageInput.trim()
    });

    setMessageInput("");
};



return (
    <div>
        <h2>Chat Connection Status</h2>

        <p>
            Status: {connected ? "Connected ✅" : "Disconnected ❌"}
        </p>

        {error && <p>Error: {error}</p>}

        <hr />

        <h3>Messages</h3>

        <div className="messages-container">
            {messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender;
            const isMyMessage = String(senderId) === String(currentUserId);

                return (
                    <div
                        key={msg._id}
                        className={`message-row ${isMyMessage ? "my-message" : "other-message"}`}
                    >
                        <div className="message-bubble">
                            <p>{msg.content}</p>
                            <small>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </small>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="chat-input-container">
            <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                }}
            />

            <button
                className="send-button"
                onClick={sendMessage}
                disabled={!messageInput.trim() || !connected}
            >
                Send
            </button>
        </div>
    </div>
);
};

export default ChatConnection;