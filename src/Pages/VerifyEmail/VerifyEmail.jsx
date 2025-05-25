import React from 'react';
import { Link } from 'react-router-dom';

function VerifyEmail() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
      <p className="mb-6 text-center">
        A verification email has been sent. Please verify your email before logging in.
      </p>
      <Link
        to="/signin"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default VerifyEmail;
