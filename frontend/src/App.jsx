
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import { Toaster } from "react-hot-toast";
// import Purchases from "./components/Purchases";
// import Buy from "./components/Buy";
// import Courses from "./components/Courses";
// import CourseCreate from "./admin/CourseCreate";
// import AdminLogin from "./admin/Admin.Login";
// import AdminSignUp from "./admin/Admin.SignUp";
// import Dashboard from "./admin/Dashboard";
// import UpdateCourse from "./admin/UpdateCourse";
// import OurCourse from "./admin/OurCourses";

// function App() {
//   // const user =JSON.parse(localStorage.getItem("user"))
//   // const admin=JSON.parse(localStorage.getItem("admin"))
//   return (
  
//       <div>
//         <Routes>
//           {/* User Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/buy/:courseId" element={<Buy />} />
//           <Route path="/purchases" element={<Purchases />} />

//           {/* Admin Routes */}
//           <Route path="/admin/login" element={<AdminLogin />} /> 
//           <Route path="/admin/signup" element={<AdminSignUp />} />
//           <Route path="/admin/courses" element={<CourseCreate />} />
//           <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//           <Route path="/admin/our-courses" element={<OurCourse />} />
//         </Routes>
//         <Toaster />
//       </div>
    
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";
import AdminSignup from "./admin/Admin.SignUp";
import AdminLogin from "./admin/Admin.Login";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
      setAdmin(JSON.parse(localStorage.getItem("admin")) || null);
    } catch (error) {
      console.error("Error parsing localStorage:", error);
      setUser(null);
      setAdmin(null);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Other Routes */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={user ? <Purchases /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={admin ? <Dashboard /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
