import { useEffect, useState } from "react";
import { auth, db } from "../pages/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setNewName(docSnap.data().name);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });
      alert("Profile updated successfully!");
      setUserData({ ...userData, name: newName });
    } catch (err) {
      alert("Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-green-500 to-blue-500 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Knowledge Hub</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-1 bg-purple-500 rounded hover:bg-purple-600 transition"
        >
          Back to Dashboard
        </button>
      </nav>

      {/* Profile Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {userData ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
            <p className="mb-2">Email: {userData.email}</p>
            <form onSubmit={handleUpdate} className="flex flex-col items-center">
              <input
                className="border-none p-3 mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600 transition"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Name"}
              </button>
            </form>
          </>
        ) : (
          <p>Loading your data...</p>
        )}
      </div>
    </div>
  );
}
