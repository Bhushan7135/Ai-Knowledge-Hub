import { useEffect, useState } from "react";
import { ArrowLeft, Send, PlusCircle, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  createChat,
  addMessageToChat,
  renameChat,
  deleteChat,
  togglePinChat,
  db,
} from "../pages/firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";

export default function AIChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

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
    const chatId = await createChat(user.uid);
    setCurrentChatId(chatId);
    setMessages([]);
    alert("New chat started!");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    if (currentChatId) {
      await addMessageToChat(currentChatId, newMessage);
    }

    // Mock AI response
    setTimeout(async () => {
      const aiMessage = {
        role: "ai",
        text: "AI Response: " + input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (currentChatId) await addMessageToChat(currentChatId, aiMessage);
    }, 600);
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
              className="p-3 bg-white/10 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition shadow-md relative"
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
                <p className="text-xs opacity-50 text-right">
                  {chat.lastUpdated
                    ? new Date(
                        chat.lastUpdated.seconds * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>

              {/* 3-dot Menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(
                      openDropdownId === chat.id ? null : chat.id
                    );
                  }}
                  className="chat-dropdown-btn text-white hover:text-yellow-300"
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`chat-dropdown absolute right-0 mt-2 w-36 bg-white/90 text-black rounded-lg shadow-lg z-10 backdrop-blur-md border border-gray-200 transition transform origin-top-right duration-200 ${
                    openDropdownId === chat.id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const newTitle = prompt(
                        "Enter new chat title:",
                        chat.title
                      );
                      if (newTitle) await renameChat(chat.id, newTitle);
                      setOpenDropdownId(null);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition rounded-t-lg"
                  >
                    Rename
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await togglePinChat(chat.id, chat.pinned);
                      setOpenDropdownId(null);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-600 hover:text-black transition"
                  >
                    {chat.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this chat?"))
                        await deleteChat(chat.id);
                      setOpenDropdownId(null);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 hover:text-white transition rounded-b-lg"
                  >
                    Delete
                  </button>
                </div>
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
