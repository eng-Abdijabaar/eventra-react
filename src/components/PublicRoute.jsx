import { Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import { Loader2 } from "lucide-react";

const PublicRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
      return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-10 h-10 " color='blue' /> </div>;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;