"use client";
import { useState } from "react";
import Developer from "../../components/Dashboard/Developer";
import Creator from "../../components/Dashboard/Creator";
import React from "react";
import { useCurrentUser } from "../../hooks/useAuth";

type Role = "developer" | "creator";

const Dashboard = () => {
  const { data:user } = useCurrentUser()
  if (!user) {
    return
  }

  const role = user.role

  return (
    <div className="min-h-screen bg-ink-950 bg-fixed bg-[radial-gradient(60%_50%_at_50%_0%,rgba(245,106,28,0.12),transparent_70%),radial-gradient(40%_40%_at_85%_20%,rgba(84,104,255,0.10),transparent_70%)]">
      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {role === "CREATOR" ?  <Creator /> : <Developer/>}
      </main>
    </div>
  );
};

export default Dashboard;
