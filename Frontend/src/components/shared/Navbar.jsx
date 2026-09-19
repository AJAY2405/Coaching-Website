import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { useTheme } from "../theme-provider";
import {
  User,
  Home,
  ClipboardList,
  FileText,
  TrendingUp,
  Bell,
  PlusCircle,
  BarChart3,
  UploadCloud,
  Megaphone,
  Info,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  User2,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constants";
import { setUser } from "../../redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();


  const [open, setOpen] = useState(true);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;
  const collapsed = !open;

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <li className="relative group">
        <Link
          to={to}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          } ${
            active
              ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Icon size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </Link>

        {collapsed && (
          <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            {label}
          </span>
        )}
      </li>
    );
  };

  return (
    <>
      {/*  floating button to reopen the sidebar when it's fully hidden on mobile */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-2 text-gray-700 dark:text-gray-300"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* Mobile overlay backdrop — only when sidebar is open on small screens */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-30"
        />
      )}

      {/*  Sidebar — the ONLY nav element now, no separate top navbar */}
      <aside
        className={`bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 fixed top-0 left-0 h-full z-40
        transform transition-all duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "md:w-[72px]" : "w-[250px]"}`}
      >
        {/* Header: logo + collapse toggle */}
        <div
          className={`flex items-center border-b border-gray-100 dark:border-gray-800 px-3 py-4 ${
            collapsed ? "flex-col gap-2" : "justify-between"
          }`}
        >
          {!collapsed && (
            <img src="/Images/logo.png" alt="Logo" className="h-9 select-none" />
          )}

          <div className={`flex items-center gap-1 ${collapsed ? "flex-col" : ""}`}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition"
              title={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
        </div>

        {/* User name */}
        {user && !collapsed && (
          <div className="px-4 pt-4 pb-2">
            <p className="text-gray-900 dark:text-white font-bold text-1.5xl truncate">
              {user?.fullname}
            </p>
          </div>
        )}

        {/* Links */}
        <ul className="flex-1 overflow-y-auto flex flex-col gap-1 p-2 mt-2">
          <NavItem to="/" icon={Home} label="Home" />

          {user?.role === "student" && (
            <>
              <NavItem to="/test" icon={ClipboardList} label="Test" />
      <NavItem to="/student/ai-tests" icon={Sparkles} label="AI Test" />
    <NavItem to="/student/ai-test-results" icon={TrendingUp} label="AI Results" />
    <NavItem to="/notes" icon={FileText} label="Notes" />
    <NavItem to="/progress" icon={TrendingUp} label="My Progress" />
    <NavItem to="/notices" icon={Bell} label="Notice" />
            </>
          )}

          {user?.role === "teacher" && (
            <>
               <NavItem to="/teacher/create-test" icon={PlusCircle} label="Create Test" />
    <NavItem to="/teacher/results" icon={BarChart3} label="Results" />
    {/* <NavItem to="/teacher/create-ai-test" icon={Sparkles} label="Create AI Test" /> */}
    <NavItem to="/teacher/ai-tests" icon={ClipboardList} label="My AI Tests" />
    <NavItem to="/teacher/ai-test-results" icon={BarChart3} label="AI Test Results" />
    <NavItem to="/notes/upload" icon={UploadCloud} label="Upload Notes" />
    <NavItem to="/create-notice" icon={Megaphone} label="New Notice" />
            </>
          )}

          <NavItem to="/about" icon={Info} label="About" />
        </ul>

        {/* Bottom section */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-2">
          {user ? (
            <div className="flex flex-col gap-1">

              {/*  Theme toggle (replaces old Settings link) */}
              <div className="relative group">
                <button
                  onClick={toggleTheme}
                  className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  {isDark ? (
                    <Sun size={20} className="shrink-0" />
                  ) : (
                    <Moon size={20} className="shrink-0" />
                  )}
                  {!collapsed && (
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  )}
                </button>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </div>
              <div className="relative group">
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                 <User2 size={20} className="shrink-0" />
                  {!collapsed && <span>Profile</span>}
                </Link>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Profile
                  </span>
                )}
              </div>

              <div className="relative group">
                <button
                  onClick={logoutHandler}
                  className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <LogOut size={20} className="shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </button>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Logout
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className={`flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="cursor-pointer w-full text-orange-400">
                  {collapsed ? "→" : "Login"}
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white w-full">
                  {collapsed ? "+" : "Signup"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;