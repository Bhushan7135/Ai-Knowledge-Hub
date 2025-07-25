import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../pages/firebase";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleReset}>
          <input
            className="border p-2 w-full mb-3 rounded"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm text-center mt-3">
          <Link className="text-green-500" to="/">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
