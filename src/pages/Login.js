import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page refresh
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("Login Details: ", { email, password });
    alert("Login Successfull(Dummyyyyyyyy)");
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="border p-2 w-full mb-3 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-3 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-3">
          Don't have an account?
          <Link className="text-green-500" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
