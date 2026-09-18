
// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AiAgentButton from "./AiAgentButton";

// Simple Spinner component (you can customize)
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 z-50">
    <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  // React Router gives "loading" state during navigation
  const isLoading = navigation.state === "loading";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black relative transition-colors duration-300">
      {/* Sidebar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Right Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${isOpen ? "ml-[260px]" : "ml-0"} 
          md:ml-[260px]`}
      >
        {/* Loading Overlay */}
        {isLoading && <LoadingSpinner />}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet /> {/* Profile, Student Table, Teacher Table, etc. */}
        </div>

        {/* Footer */}
        <Footer />
      </div>
      <AiAgentButton to="/chat" />
    </div>
  );
};

export default Layout;