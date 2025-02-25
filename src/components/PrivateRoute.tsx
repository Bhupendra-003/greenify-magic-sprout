
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  userType: "citizen" | "ngo";
}

export function PrivateRoute({ children, userType }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.type !== userType) {
    return <Navigate to={`/${user.type}/dashboard`} replace />;
  }

  return <>{children}</>;
}
