import { useAuth } from "@/context/AuthProvider";
import { Loader } from "lucide-react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  if (!user)
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  return children;
}
