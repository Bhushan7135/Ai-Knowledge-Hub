import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../pages/firebase"; 
import image1 from "../Assets/image_1.jpg"; 
import { doc, setDoc } from "firebase/firestore";  

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Step 2: Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      alert(`Welcome, ${name}! Your account has been created.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${image1})` }}
    >
      {/* Glassmorphism Card */}
      <div className="flex w-3/4 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
        
        {/* Left Register Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Create Your Account
          </h2>
          <form onSubmit={handleRegister}>
            <input
              className="border-none p-3 w-full mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border-none p-3 w-full mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-none p-3 w-full mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 w-full py-2 rounded text-white font-semibold hover:from-green-600 hover:to-green-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-white">
            Already have an account?{" "}
            <Link className="text-yellow-300 hover:underline" to="/">
              Login
            </Link>
          </p>
        </div>

        {/* Right Quote Section */}
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Start Your Journey with Knowledge – Register Now and Build Your Hub!
          </h3>
        </div>
      </div>
    </div>
  );
}
