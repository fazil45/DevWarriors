"use client";
import { useState } from "react";
import Developer from "../../components/Developer";
import Creator from "../../components/Creator";
import React from "react";

type Role = "developer" | "creator";

const Dashboard = () => {
  const [role, setRole] = useState<Role>("developer");
  return (
    <div className="min-h-screen bg-ink-950 bg-fixed bg-[radial-gradient(60%_50%_at_50%_0%,rgba(245,106,28,0.12),transparent_70%),radial-gradient(40%_40%_at_85%_20%,rgba(84,104,255,0.10),transparent_70%)]">
      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {role === "developer" ? <Developer /> : <Creator />}
      </main>
    </div>
  );
};

export default Dashboard;
