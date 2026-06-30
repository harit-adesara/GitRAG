import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [addPassword, setAddPassword] = useState("");

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showAddPasswordBox, setShowAddPasswordBox] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(
          "https://gitrag-awh4.onrender.com/gitrag/me",
          {
            withCredentials: true,
          },
        );

        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const showMessage = (message, type = "success") => {
    setStatus(message);
    setStatusType(type);

    setTimeout(() => {
      setStatus("");
      setStatusType("");
    }, 5000);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showMessage("All fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("New passwords do not match", "error");
      return;
    }

    try {
      await axiosInstance.post(
        "https://gitrag-awh4.onrender.com/gitrag/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        },
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage("Password changed successfully");
    } catch (err) {
      showMessage("Failed to change password", "error");
    }
  };

  const handleAddPassword = async () => {
    if (!addPassword) {
      showMessage("Password is required", "error");
      return;
    }

    try {
      await axiosInstance.post(
        "https://gitrag-awh4.onrender.com/gitrag/oath-set-password",
        {
          password: addPassword,
        },
        {
          withCredentials: true,
        },
      );

      setAddPassword("");

      showMessage("Password added successfully");
    } catch (err) {
      showMessage("Failed to add password", "error");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-[#8b8b9b] mt-4">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        <p className="text-[#8b8b9b] mt-2">
          Manage your account settings and password.
        </p>
      </div>

      {status && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm border ${
            statusType === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}
        >
          {status}
        </div>
      )}

      <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>

            <p className="text-[#8b8b9b]">@{user.username}</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <p className="text-[#6a6a78] text-sm">Full Name</p>
            <p className="text-white font-medium mt-1">{user.name}</p>
          </div>

          <div>
            <p className="text-[#6a6a78] text-sm">Username</p>
            <p className="text-white font-medium mt-1">{user.username}</p>
          </div>

          <div>
            <p className="text-[#6a6a78] text-sm">Email</p>
            <p className="text-white font-medium mt-1">{user.email}</p>
          </div>

          <div>
            <p className="text-[#6a6a78] text-sm">Email Verification</p>

            <p
              className={`font-medium mt-1 ${
                user.isEmailVerified ? "text-green-400" : "text-red-400"
              }`}
            >
              {user.isEmailVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-200">
        <button
          onClick={() => setShowPasswordBox(!showPasswordBox)}
          className="w-full flex items-center justify-between text-white font-semibold text-lg"
        >
          Change Password
          <span className="text-[#8b8b9b]">{showPasswordBox ? "▲" : "▼"}</span>
        </button>

        {showPasswordBox && (
          <div className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#13131a] border border-[#1e1e2a] text-white placeholder:text-[#4a4a5a] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#13131a] border border-[#1e1e2a] text-white placeholder:text-[#4a4a5a] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#13131a] border border-[#1e1e2a] text-white placeholder:text-[#4a4a5a] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            <button
              onClick={handleChangePassword}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-200">
        <button
          onClick={() => setShowAddPasswordBox(!showAddPasswordBox)}
          className="w-full flex items-center justify-between text-white font-semibold text-lg"
        >
          Add Password
          <span className="text-[#8b8b9b]">
            {showAddPasswordBox ? "▲" : "▼"}
          </span>
        </button>

        {showAddPasswordBox && (
          <div className="mt-6">
            <p className="text-[#8b8b9b] text-sm mb-4">
              Use this if you signed in with Google and want to set a password.
            </p>

            <input
              type="password"
              placeholder="Set Password"
              value={addPassword}
              onChange={(e) => setAddPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#13131a] border border-[#1e1e2a] text-white placeholder:text-[#4a4a5a] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            <button
              onClick={handleAddPassword}
              className="w-full mt-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
            >
              Add Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
