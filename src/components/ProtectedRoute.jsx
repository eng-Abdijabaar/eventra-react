import { Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import {Loader2} from "lucide-react"

const ProtectedRoute = ({children}) => {
    const { isSignedIn, isLoaded } = useAuth();

     if (!isLoaded) {
      return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-10 h-10 " color='blue' /> </div>;
    }

    if (!isSignedIn) {
      return <Navigate to="/login" />;
    }

  return children;

}

export default ProtectedRoute