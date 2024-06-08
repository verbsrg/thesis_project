import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import RootLayout from "@/layouts/RootLayout";
import LearnPage from "./pages/LearnPage";
import ErrorPage from "./pages/ErrorPage";
import { ThemeProvider } from "./components/theme-provider";
import AuthProvider from "./context/AuthProvider";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AnonymousRoute from "./components/AnonymousRoute";
import ForgotPassoword from "./pages/ForgotPasswordPage";
import UpdatePassword from "./pages/UpdatePasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: async () => redirect("/learn"),
      },
      {
        path: "/signin",
        element: (
          <AnonymousRoute>
            <SignIn />
          </AnonymousRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <AnonymousRoute>
            <SignUp />
          </AnonymousRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <AnonymousRoute>
            <ForgotPassoword />
          </AnonymousRoute>
        ),
      },
      {
        path: "/update-password",
        element: (
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/verify-otp",
        element: (
          <AnonymousRoute>
            <VerifyOTPPage />
          </AnonymousRoute>
        ),
      },
      {
        path: "/learn",
        element: (
          <ProtectedRoute>
            <LearnPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
