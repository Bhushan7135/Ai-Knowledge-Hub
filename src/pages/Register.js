import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }
    console.log("Register details:", { name, email, password });
    alert("Registered successfully (dummy)");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            className="border p-2 w-full mb-3 rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
