import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from "cors";
import {createServer} from "http";
import {Server} from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import socketAuth from "./middleware/socketAuth.js";
import chatRoutes from "./routes/chatRoutes.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";

connectDB();


const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors({
  origin: "http://localhost:5173"
}));

io.use(socketAuth);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chats", chatRoutes);

app.get('/',(req,res)=>{
    res.send("Server is ready")
})



io.on("connection", (socket) => {
  console.log("Authenticated user connected:", socket.user.name);

  
  socket.on("joinChat", async (chatId) => {
    try {
      
      const chat = await Chat.findById(chatId);

      if (!chat) {
        socket.emit("chatError", "Chat not found");
        return;
      }

      // Check whether logged-in user is a participant
      const isParticipant = chat.participants.some(
        (participantId) =>
          participantId.toString() === socket.user._id.toString()
      );

      if (!isParticipant) {
        socket.emit("chatError", "You are not authorized to join this chat");
        return;
      }

      // Join room
      socket.join(chatId);

      console.log(`${socket.user.name} joined room: ${chatId}`);

      socket.emit("joinedChat", {
        success: true,
        message: "Joined chat room successfully",
        chatId
      });

    } catch (error) {
      console.log("Join chat error:", error.message);
      socket.emit("chatError", "Unable to join chat room");
    }
  });

  // Send Message Event
 socket.on("sendMessage", async ({ chatId, content }) => {
  try {
     console.log("SendMessage event received:", chatId, content);
    // Step 1: Validate message
    if (!chatId || !content || !content.trim()) {
      socket.emit("chatError", "Chat ID and message are required");
      return;
    }

    if (content.trim().length > 2000) {
      socket.emit("chatError", "Message cannot exceed 2000 characters");
      return;
    }

    // Step 2: Check whether user joined this room
    if (!socket.rooms.has(chatId)) {
      socket.emit("chatError", "Please join the chat first");
      return;
    }

    // Step 3: Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      socket.emit("chatError", "Chat not found");
      return;
    }

    // Step 4: Verify participant
    const isParticipant = chat.participants.some(
      (participantId) =>
        participantId.toString() === socket.user._id.toString()
    );

    if (!isParticipant) {
      socket.emit("chatError", "Unauthorized access");
      return;
    }

    // Step 5: Save message in MongoDB
    const message = await Message.create({
  chat: chatId,
  sender: socket.user._id,
  content: content
});
console.log("Message saved:", message);
    // Step 6: Update latest message in Chat
    chat.lastMessage = message._id;
    await chat.save();

    
   console.log("Message sent successfully");

    // Step 7: Get populated message
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role profileImage");

    // Step 8: Send message to room participants
    io.to(chatId).emit("newMessage", populatedMessage);

    console.log("Message sent:", populatedMessage.content);

  } catch (error) {
    console.log("Send message error:", error.message);
    socket.emit("chatError", "Message could not be sent");
  }
});

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.name);
  });
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});