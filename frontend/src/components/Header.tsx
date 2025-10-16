"use client";

import Image from "next/image";
import { useState } from "react";
import Dialog from "./Dialog";

interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps = {}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login submitted");
    setIsLoginOpen(false);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement register logic
    console.log("Register submitted");
    setIsRegisterOpen(false);
  };

  return (
    <>
      <header className="bg-white h-[5rem] md:h-[6.5rem] flex items-center px-4 sm:px-8 md:px-12 lg:px-16 border-b border-gray-100 transition-all duration-300">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-all duration-200 hover:scale-105"
        >
          <Image
            src="/logo.svg"
            alt="Podcastr"
            width={32}
            height={32}
            className="md:w-[40px] md:h-[40px] transition-transform duration-200"
          />
          <h1 className="font-lexend font-extrabold text-gray-800 text-[1.25rem] md:text-[1.5rem] leading-none">
            Podcastr
          </h1>
        </button>
        
        <p className="ml-8 md:ml-20 font-inter text-gray-500 text-[0.75rem] md:text-[0.875rem] transition-colors duration-200 hidden sm:block">
          The best for you to listen, always
        </p>
        
        <div className="ml-auto flex items-center gap-3 md:gap-4">
          <time className="font-inter text-gray-500 text-[0.75rem] md:text-[0.875rem] capitalize transition-colors duration-200 hidden md:block">
            {today}
          </time>
          
          <button
            onClick={() => setIsLoginOpen(true)}
            className="font-inter font-medium text-purple-500 hover:text-purple-600 text-[0.875rem] md:text-[1rem] transition-all duration-200 hover:scale-105"
          >
            Login
          </button>
          
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="font-inter font-semibold bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[0.875rem] md:text-[1rem] transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Register
          </button>
        </div>
      </header>

      {/* Login Dialog */}
      <Dialog 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        title="Login to Podcastr"
      >
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="login-password" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            Login
          </button>
          
          <p className="text-center font-inter text-[0.875rem] text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
              className="text-purple-500 hover:text-purple-600 font-semibold transition-colors duration-200"
            >
              Register
            </button>
          </p>
        </form>
      </Dialog>

      {/* Register Dialog */}
      <Dialog 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        title="Register for Podcastr"
      >
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="register-name" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="register-email" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="register-password" className="block font-inter font-medium text-gray-700 text-[0.875rem] mb-2">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-inter text-[0.9375rem] outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-inter font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            Register
          </button>
          
          <p className="text-center font-inter text-[0.875rem] text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
              className="text-purple-500 hover:text-purple-600 font-semibold transition-colors duration-200"
            >
              Login
            </button>
          </p>
        </form>
      </Dialog>
    </>
  );
}
