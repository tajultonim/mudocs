"use client"


import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import LeftSidebar from "@/components/left-sidebar";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="sm:hidden z-50 bg-gray-800 p-2 h-8 rounded-full text-white shadow-md"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar menu"
      >
        <IoMenu />
      </button>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300 sm:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4">
          <button
            className="mb-4 text-white"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar menu"
          >
            ✕
          </button>
          <LeftSidebar />
        </div>
      </div>
    </>
  );
}
