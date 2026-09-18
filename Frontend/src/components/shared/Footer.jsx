
import React from "react";
import {
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const address = "Ward No. 15, Sultanpur Barahgawa, Madhuban, Mau, Uttar Pradesh, 221603";
  // ✅ NEW: exact coordinates for accurate pin placement
  const latitude = 26.1654418;
  const longitude = 83.68197;

  return (
    <footer className="bg-[#FAF6F2] dark:bg-black text-gray-800 dark:text-gray-200 mt-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-10 rounded-2xl shadow-md dark:shadow-none dark:border dark:border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* School Logo & Name */}
          <div className="flex flex-col items-center sm:items-start">
            <img
              src="/Images/logo.png"
              alt="School Logo"
              className="w-16 h-16 mb-3"
            />
            <h2 className="text-xl font-bold">Mangaldeep Academy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center sm:text-left">
              Excellence in Education, Empowering the Future.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex space-x-5 text-2xl text-gray-700 dark:text-gray-300">
              <a
                href="https://wa.me/919569559316"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500 transition"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rahul372602@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Contact Info / Location */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold mb-3">Visit Us</h3>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0" />
              <span>{address}</span>
            </div>
            {/* ✅ FIX: use exact lat/lng instead of a text search for an accurate pin */}
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline mt-2"
            >
              View on Map →
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-800 mt-6 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Mangaldeep Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;