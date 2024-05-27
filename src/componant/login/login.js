import React from 'react';
import './index.css';

export default function Login() {
  return (
<div className="grid grid-cols-2 items-center justify-center w-screen h-screen bg-white relative">
      <div className="relative w-full h-full flex items-center justify-center z-20">
      <div className="flex flex-col items-center justify-center w-full sm:w-[500px] mx-auto">
        <h1 className="text-3xl text-blue-600 mb-2 m-auto">Admin dashboard</h1>
        <p className="text-gray-400 mb-6">Enter your email and password to sign in</p>
        <form className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your password"
              />
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                SIGN IN
              </button>
            </div>
            </form>
        </div>
      </div>
      <div className="bg-blue-800 background-image w-full h-full lg:w-auto lg:h-full rounded-bl-[25px] flex items-center justify-center z-10">  <span className="text-2xl text-white">Temp logo</span>
</div>
    </div>
  );
}   