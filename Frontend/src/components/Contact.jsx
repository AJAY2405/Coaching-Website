import React from "react";

function Contact() {
  return (
    <div
      id="contacts"
      className="min-h-screen flex items-center justify-center bg-[#f9f8f7] px-4"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#E48D3C]">
          Contact Us
        </h1>

       
        <form
          action="https://formsubmit.co/rahul372602@gmail.com"
          method="POST"
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#E48D3C]"
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
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#E48D3C]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message..."
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-[#E48D3C]"
            ></textarea>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#E48D3C] text-white font-semibold hover:bg-[#d67d2c]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;