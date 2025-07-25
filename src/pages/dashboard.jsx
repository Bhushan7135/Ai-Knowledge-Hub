import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [userData, setUserData] = useState(null);
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
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Knowledge Hub</h1>
        <div>
          {userData && <span className="mr-4">Hello, {userData.name}</span>}
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full">
        {userData ? (
          <>
            <h1 className="text-4xl font-bold">Welcome, {userData.name}!</h1>
            <p className="mt-2 text-lg">Your email: {userData.email}</p>
          </>
        ) : (
          <p className="text-lg">Loading your data...</p>
        )}
      </div>
    </div>
  );
}