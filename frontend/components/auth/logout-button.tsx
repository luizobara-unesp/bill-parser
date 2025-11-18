"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button
      className="w-full flex justify-between gap-5 hover:cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="" />
      <div className="w-full text-start">Logout</div>
    </button>
  );
};