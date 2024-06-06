import { Link } from "react-router-dom";
import ModeToggle from "./mode-toggle";
import User from "./User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Database, User2Icon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

export default function Header() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <header className="max-w-full border-b flex flex-wrap items-center justify-between mx-auto p-4">
      <Link
        to="/"
        className="flex justify-center items-center text-md sm:text-2xl space-x-1"
      >
        <Database />
        <p className="uppercase">4it218</p>
      </Link>
      {isDesktop ? (
        <div className="flex justify-center items-center gap-2">
          <User />
          <ModeToggle />
        </div>
      ) : (
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"ghost"}>
                <User2Icon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <User />
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      )}
    </header>
  );
}
