import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function TeacherRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "teacher") {
    // Not logged in OR not a teacher → redirect
    return <Navigate to="/" replace />;
  }

  return children; // Teacher → allow access
}
