import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResendEmail from "./pages/ResendEmail.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Layout from "./pages/Layout.jsx";
import CreateRepo from "./pages/CreateRepo.jsx";
import MyRepos from "./pages/MyRepo.jsx";
import Profile from "./pages/Profile.jsx";
import ChatList from "./pages/Chat.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import GuidePage from "./pages/Guidline.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRoute />}>
        <Route path="/layout" element={<Layout />}>
          <Route index element={<GuidePage />} />
          <Route path="create-repo" element={<CreateRepo />} />
          <Route path="repos" element={<MyRepos />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat/:repoId" element={<ChatList />} />
          <Route path="chat-page/:chatId" element={<ChatPage />} />
        </Route>
      </Route>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resend-verification" element={<ResendEmail />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route
          path="/verify-email/:verificationToken"
          element={<VerifyEmail />}
        />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
