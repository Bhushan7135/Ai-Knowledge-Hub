import { Navigate } from "react-router-dom";
import { useAuth, useauth } from "../pages/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/" />;
}
