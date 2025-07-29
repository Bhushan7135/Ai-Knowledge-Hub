import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  console.log("userData", userData);
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log("docSnap", docSnap);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">AI Knowledge Hub</h1>
        <div>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-1 bg-green-500 rounded hover:bg-green-600 transition mr-2"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <header className="p-8 text-center">
        <h2 className="text-4xl font-extrabold mb-2">
          Welcome, {userData ? userData.name : "Loading..."}!
        </h2>
        <p className="text-lg opacity-90">
          Unlock the power of AI and manage your knowledge with ease.
        </p>
      </header>

      {/* Widgets Section */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white/20 p-6 rounded-xl shadow hover:scale-105 transition-transform cursor-pointer">
          <div onClick={() => navigate("/notes")}>
            <h3 className="text-xl font-semibold">Saved Notes</h3>
            <p className="mt-2 text-sm opacity-90">
              Keep track of your important data.
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/ai-chat")}
          className="cursor-pointer bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 hover:bg-white/30 transition"
        >
          <h2 className="text-2xl font-bold">AI Chat</h2>
          <p className="text-sm text-gray-200">
            Converse with your AI assistant.
          </p>
        </div>
        <div className="bg-white/20 p-6 rounded-xl shadow hover:scale-105 transition-transform cursor-pointer">
          <h3 className="text-xl font-semibold">Recent Searches</h3>
          <p className="mt-2 text-sm opacity-90">View your latest queries.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-sm opacity-75 mt-6">
        © 2025 AI Knowledge Hub - Built with ❤️
      </footer>
    </div>
  );
}
