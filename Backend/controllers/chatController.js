import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";


export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate("participants", "name email role profileImage")
      .populate({
        path: "lastMessage",
        select: "content sender createdAt"
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Create or get existing chat
export const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;

    const loggedInUser = req.user;

    // Step 1: Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Step 2: Prevent chatting with yourself
    if (loggedInUser._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself"
      });
    }

    // Step 3: Find other participant
    const otherUser = await User.findById(userId);

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Step 4: Only student and alumni can chat
    if (!["student", "alumni"].includes(otherUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Invalid chat participant"
      });
    }

    // Step 5: Check roles
    const validRoles =
      (loggedInUser.role === "student" && otherUser.role === "alumni") ||
      (loggedInUser.role === "alumni" && otherUser.role === "student");

    if (!validRoles) {
      return res.status(403).json({
        success: false,
        message: "Chat is allowed only between students and alumni"
      });
    }

    // Step 6: Check blocked account
    if (otherUser.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This user is unavailable"
      });
    }

    // Step 7: Find existing conversation
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUser._id, otherUser._id] }
    }).populate("participants", "name email role profileImage");

    // Step 8: Create new conversation if not found
    if (!chat) {
      chat = await Chat.create({
        participants: [loggedInUser._id, otherUser._id]
      });

      chat = await chat.populate(
        "participants",
        "name email role profileImage"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Chat fetched successfully",
      data: chat
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    const isParticipant = chat.participants.some(
      (participantId) =>
        participantId.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email role profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};