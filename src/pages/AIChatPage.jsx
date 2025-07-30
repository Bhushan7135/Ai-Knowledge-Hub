import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, PlusCircle, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendToGemini } from "../services/geminiService";
import {
  auth,
  createChat,
  addMessageToChat,
  renameChat,
  deleteChat,
  togglePinChat,
  db,
} from "../pages/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import jsPDF from "jspdf";

export default function AIChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const messagesEndRef = useRef(null); // For auto-scroll
  const handleRename = async (e, chat) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new chat title:", chat.title);
    if (newTitle) await renameChat(chat.id, newTitle);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm("Delete this chat?")) await deleteChat(chatId);
  };

  const handleSavePDF = (e, chat) => {
    e.stopPropagation();

    if (!chat.messages || chat.messages.length === 0) {
      alert("No messages to save!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);

    chat.messages.forEach((msg, index) => {
      doc.text(
        `${msg.role === "user" ? "You" : "AI"}: ${msg.text}`,
        10,
        10 + index * 10
      );
    });

    doc.save(`${chat.title || "chat"}.pdf`);
  };
  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Real-time Fetch Recent Chats
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentChats(chats);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const closeDropdown = () => setOpenDropdownId(null);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const handleNewChat = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to start a chat.");
      return;
    }
    const chatId = await createChat(user.uid, "New Chat");
    setCurrentChatId(chatId);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to start a chat.");
      return;
    }

    // If no chat exists, create one with first message as title
    let chatId = currentChatId;
    if (!chatId) {
      const newTitle = input.length > 30 ? input.slice(0, 30) + "..." : input;
      chatId = await createChat(user.uid, newTitle);
      setCurrentChatId(chatId);
    }

    const newMessage = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    await addMessageToChat(chatId, newMessage);

    // Call Gemini API
    const aiReply = await sendToGemini(input);
    const aiMessage = {
      role: "ai",
      text: aiReply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
    await addMessageToChat(chatId, aiMessage);

    // Update chat metadata
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: aiMessage.text,
      lastUpdated: new Date(),
    });
  };

  // Sort chats (pinned first)
  const sortedChats = [...recentChats].sort((a, b) => {
    if (a.pinned === b.pinned) {
      return (b.lastUpdated?.seconds || 0) - (a.lastUpdated?.seconds || 0);
    }
    return b.pinned - a.pinned;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-800 via-blue-700 to-purple-800 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-white/10 backdrop-blur-lg shadow-xl border-r border-white/20 p-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-yellow-300 mb-4 hover:text-yellow-400 transition transform hover:scale-105 hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Recent Chats</h2>
          <button
            onClick={handleNewChat}
            className="text-green-400 hover:text-green-500"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-3">
          {sortedChats.map((chat) => (
            <li
              key={chat.id}
              className="group relative p-3 bg-white/10 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition shadow-md"
            >
              <div
                onClick={() => {
                  setCurrentChatId(chat.id);
                  setMessages(chat.messages || []);
                }}
                className="cursor-pointer"
              >
                <p className="font-semibold flex justify-between items-center">
                  {chat.title || "Untitled Chat"}
                  {chat.pinned && (
                    <span className="text-yellow-400 text-xs">📌</span>
                  )}
                </p>
                <p className="text-xs opacity-80 truncate">
                  {chat.lastMessage || "No messages yet..."}
                </p>
              </div>

              {/* Hover Action Buttons */}
              <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
                <button
                  onClick={(e) => handleRename(e, chat)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded"
                >
                  Rename
                </button>
                <button
                  onClick={(e) => handleSavePDF(e, chat)}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded"
                >
                  Save
                </button>
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold shadow-lg">
          AI Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white/5 backdrop-blur-md">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 ${
                msg.role === "user" ? "justify-end space-x-reverse" : ""
              }`}
            >
              <div className="bg-white/30 p-2 rounded-full">
                {msg.role === "ai" ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`p-4 rounded-2xl max-w-sm shadow-md ${
                  msg.role === "user"
                    ? "bg-yellow-300 text-black"
                    : "bg-gradient-to-r from-blue-400/40 to-blue-600/40 text-white"
                }`}
              >
                {msg.text}
                <div className="text-xs mt-1 opacity-70 text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex p-4 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
        >
          <input
            className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-yellow-400 text-black px-5 rounded-lg hover:bg-yellow-500 flex items-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
