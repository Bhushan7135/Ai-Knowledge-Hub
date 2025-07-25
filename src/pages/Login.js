import { useState } from "react";
import { Link } from "react-router-dom";
import image1 from "../Assets/image_1.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../pages/firebase";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome ${userCredential.user.email}`);
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
        {/* Left Login Form */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin}>
            <input
              className="border-none p-3 w-full mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-none p-3 w-full mb-4 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm text-white mb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-blue-500" />
                <span>Remember me?</span>
              </label>
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 w-full py-2 rounded text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-white">
            Don't have an account?{" "}
            <Link className="text-yellow-300 hover:underline" to="/register">
              Register
            </Link>
          </p>
        </div>

        {/* Right Quote Section */}
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Unlock the Power of Your Knowledge – Your AI Assistant, Your Memory,
            Your Hub.
          </h3>
        </div>
      </div>
    </div>
  );
}
