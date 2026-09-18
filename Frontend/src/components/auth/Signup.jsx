import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoading } from "../../redux/authSlice"; // adjust path
import { USER_API_END_POINT } from "../../utils/constants"; // adjust path
import { Typewriter } from "react-simple-typewriter";
import { Eye, EyeOff } from "lucide-react";


const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    // role: "",
    file: "",
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
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role || "student");

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Images/logo.png"
          alt="MDA Coaching Institute"
          className="w-24 h-24 object-contain"
        />

        <h1 className="mt-3 text-2xl font-bold text-[#1F2A56] text-center">
          MDA Coaching Institute
        </h1>

        <p className="text-gray-500 text-sm mt-2 text-center">
          Create your account to start learning
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={submitHandler} className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeEventHandler}
            placeholder="Enter your phone number"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
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
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-3 text-sm text-gray-400">
          Already have an account?
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Login Link */}
      <p className="text-center text-gray-600">
        <Link
          to="/login"
          className="text-orange-500 font-semibold hover:underline"
        >
          Login Here
        </Link>
      </p>

    </div>
  </div>
);
};

export default Signup;




