"use client";
import SideBar from "./SideBar";
import { useSideBar } from "../store/showSideBar";

export default function SideBarWrapper() {
  const { showSideBar } = useSideBar();
  return (
    <div className={showSideBar ? "block" : "hidden"}>
      <SideBar />
    </div>
  );
}
