import { useAuth } from "@/context/AuthProvider";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AnonymousRouteProps = PropsWithChildren;

export default function AnonymousRoute({ children }: AnonymousRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  return children;
}
