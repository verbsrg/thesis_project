import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthProvider";
import { useMediaQuery } from "react-responsive";

export default function User() {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };
  const { user } = useAuth();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <div>
      {user ? (
        isDesktop ? (
          <div className="flex justify-center items-center space-x-2">
            <span className="text-sm">{user?.email}</span>
            <Button variant={"secondary"} size={"sm"} onClick={signOut}>
              <LogOutIcon size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2 my-2">
            <span className="text-sm mt-2">{user?.email}</span>
            <Button variant={"secondary"} size={"sm"} onClick={signOut}>
              <span className="mr-1">Odhlásit se</span>
              <LogOutIcon size={16} />
            </Button>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center">
          <Link
            to="/signin"
            className={twMerge(
              buttonVariants({ variant: "secondary" }),
              "my-2 sm:my-0"
            )}
          >
            Přihlásit se
          </Link>
        </div>
      )}
    </div>
  );
}
