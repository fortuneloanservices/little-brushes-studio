import { Navigate } from "react-router-dom";
import { useAuth, roleHome } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  return <Navigate to={user ? roleHome(user.role) : "/login"} replace />;
}
