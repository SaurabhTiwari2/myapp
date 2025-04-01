import React, { useState } from "react";
import logo from "../../public/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";
function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        { firstName, lastName, email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup successful: ", response.data);
      toast.success(response.data.message || "Signup successful!");  
      navigate("admin/login");
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.errors || "Signup failed!!!";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);  // Show toast for error
      } else {
        setErrorMessage("Something went wrong. Please try again!");
        toast.error("Something went wrong. Please try again!");  //  Show toast for unknown error
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <Toaster position="top-right" reverseOrder={false} />  
      
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to="/" className="text-xl font-bold text-orange-500">
              CodeSprint
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/login" className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md">
              Login
            </Link>
            <Link to="/courses" className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md">
              Join now
            </Link>
          </div>
        </header>

        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CodeSprint</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">Just Signup to mess with DashBoard !</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-gray-400 mb-2">Firstname</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 rounded-md bg-gray-800 border border-gray-700" placeholder="Type your firstname" required />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 mb-2">Lastname</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 rounded-md bg-gray-800 border border-gray-700" placeholder="Type your lastname" required />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-md bg-gray-800 border border-gray-700" placeholder="name@email.com" required />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-md bg-gray-800 border border-gray-700" placeholder="********" required />
            </div>
            {errorMessage && <div className="mb-4 text-red-500 text-center">{errorMessage}</div>}
            <button type="submit" className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition">
               Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
