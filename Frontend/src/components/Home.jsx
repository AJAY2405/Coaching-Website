import React from "react";
import Navbar from "./shared/Navbar";
import HomeSection from "./HomeSection";
import { useSelector } from "react-redux";
import TeacherHome from "./TeacherHome";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {user?.role === "teacher" ? <TeacherHome /> : <HomeSection />}
    </div>
  );
};

export default Home;