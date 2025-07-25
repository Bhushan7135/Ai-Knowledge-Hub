import { useState, useEffect } from "react";
import { auth } from "../pages/firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [photoURL, setPhotoURL] = useState(""); 
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || "");
      setUserEmail(user.email);
      setPhotoURL(user.photoURL || "https://via.placeholder.com/150?text=Profile"); // default image
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Update Display Name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Name cannot be empty!");
      return;
    }
    try {
      setLoading(true);
      await updateProfile(auth.currentUser, { displayName: name });
      alert("Name updated successfully!");
    } catch (err) {
      alert("Error updating name: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert("Password cannot be empty!");
      return;
    }
    try {
      setLoading(true);
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      alert("Error updating password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload Profile Picture
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile with new photo URL
      await updateProfile(user, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
      alert("Profile picture updated successfully!");
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-8">
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md p-4 flex justify-between items-center shadow-lg rounded-xl mb-6">
        <h1 className="text-xl font-bold">Your Profile</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-1 bg-green-500 rounded hover:bg-green-600 transition"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture Widget */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <img
            src={photoURL}
            className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md object-cover mb-4"
          />
          <label className="cursor-pointer bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition inline-block">
            {uploading ? "Uploading..." : "Upload New Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              className="hidden"
            />
          </label>
        </div>

        {/* Update Name Widget */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Update Name</h2>
          <form onSubmit={handleUpdateName} className="flex flex-col">
            <input
              className="border-none p-3 mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              type="text"
              placeholder="Enter new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Name"}
            </button>
          </form>
        </div>

        {/* Update Password Widget */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col">
            <input
              className="border-none p-3 mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-red-500 px-6 py-2 rounded hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
