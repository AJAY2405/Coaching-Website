import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StudentRoute;