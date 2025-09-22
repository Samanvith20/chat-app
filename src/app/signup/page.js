"use client";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignup } from "../utils/firebaseAuth";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";


export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
 
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSignup  = (e) => {
     e.preventDefault();
    console.log("Sign up data:", formData);
     if (!formData.name || !formData.email || !formData.password) {
    const msg = "Please fill name, email and password.";
    
    toast.error(msg);
    return;
  }
  if (formData.password.length < 6) {
    const msg = "Password must be at least 6 characters.";
    
    toast.error(msg);
    return;
  }
    handleSignup(
      formData.email,
      formData.password,
      formData.name,
    
      router
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
    
      <Toaster />
      <div className="hidden md:flex md:flex-1 bg-neutral-900 items-center justify-center p-8">
        <div className="w-full h-full max-h-[600px] bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden">
          <Image
  src="https://ca.pinterest.com/pin/20125529572714593/"
  alt="Abstract gradient background"
  className="w-full h-full object-cover"
  height={600}
  width={600}
  
/>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-neutral-400 text-base">
              Join us today and get started
            </p>
          </div>

          {/* Form */}
          <form 
          onSubmit={onSignup}
          className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className={
                    "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 " +
                    (focusedField === "name"
                      ? "text-orange-500"
                      : "text-neutral-500")
                  }
                />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className={
                    "w-full pl-11 pr-4 py-3.5 bg-neutral-800 rounded-xl text-white text-base placeholder-neutral-500 outline-none transition-colors duration-200 border-2 " +
                    (focusedField === "name"
                      ? "border-orange-500"
                      : "border-neutral-600 hover:border-neutral-500")
                  }
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={
                    "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 " +
                    (focusedField === "email"
                      ? "text-orange-500"
                      : "text-neutral-500")
                  }
                />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email address"
                  className={
                    "w-full pl-11 pr-4 py-3.5 bg-neutral-800 rounded-xl text-white text-base placeholder-neutral-500 outline-none transition-colors duration-200 border-2 " +
                    (focusedField === "email"
                      ? "border-orange-500"
                      : "border-neutral-600 hover:border-neutral-500")
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={
                    "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 " +
                    (focusedField === "password"
                      ? "text-orange-500"
                      : "text-neutral-500")
                  }
                />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  className={
                    "w-full pl-11 pr-4 py-3.5 bg-neutral-800 rounded-xl text-white text-base placeholder-neutral-500 outline-none transition-colors duration-200 border-2 " +
                    (focusedField === "password"
                      ? "border-orange-500"
                      : "border-neutral-600 hover:border-neutral-500")
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
             
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors duration-200 text-base mt-8"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-neutral-400 text-base">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
         
        </div>
      </div>
    </div>
  );
}
