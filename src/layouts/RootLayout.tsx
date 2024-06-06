import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <Toaster />
      </main>
    </>
  );
}
