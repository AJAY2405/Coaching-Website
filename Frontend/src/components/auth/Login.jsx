import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoading, setUser } from "../../redux/authSlice";
import { USER_API_END_POINT } from "../../utils/constants";
import { Typewriter } from "react-simple-typewriter";
import { Eye, EyeOff } from "lucide-react";
const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    // role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle role-based redirect
  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "teacher") {
        navigate("/teacher");
      }
    }
  }, [user, navigate]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Images/logo.png"
          alt="MDA Coaching Institute"
          className="w-24 h-24 object-contain"
        />

        <h1 className="mt-3 text-2xl font-bold text-[#1F2A56]">
          MDA Coaching Institute
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Welcome Back! Login to Continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-5">

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-orange-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <div className="my-6 border-t"></div>

      <p className="text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-orange-500 font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>

    </div>
  </div>
);
};

export default Login;













