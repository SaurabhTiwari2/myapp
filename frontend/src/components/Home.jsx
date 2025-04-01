import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/logo.jpg";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa6";
import { BACKEND_URL } from "../../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
       setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  }, []);
  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true, // Ensure cookies are sent
      });
  
      // Clear user session
      localStorage.removeItem("user");
      setIsLoggedIn(false);
  
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error in logging out", error);
      
      // Check if error is due to authentication issues
      if (error.response?.status === 401) {
        toast.error("Session expired, please log in again!");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } else {
        toast.error(error.response?.data?.error || "Error in logging out");
      }
    }
  };
  

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/course/courses`, {
        withCredentials: true,
      });
      console.log("Courses fetched:", response.data.courses);
      setCourses(response.data.courses);
    } catch (error) {
      console.log("Error in fetching courses", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src={Logo} alt="CourseHaven Logo" className="w-16 h-16 rounded-full border-2 border-orange-500" />
            <h1 className="text-2xl text-orange-500 font-bold">CodeSprint</h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="border border-white rounded py-2 px-4 hover:bg-white hover:text-black transition">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="border border-white rounded py-2 px-4 hover:bg-white hover:text-black transition">Login</Link>
                <Link to="/signup" className="border border-white rounded py-2 px-4 hover:bg-white hover:text-black transition">Signup</Link>
              </>
            )}
          </div>
        </header>

        {/* Main Section */}
        <main className="text-center mt-10">
          <h1 className="text-4xl font-semibold text-orange-500">CodeSprint</h1>
          <p className="text-gray-400 mt-2">Sharpen your skills with courses crafted by experts</p>
          <div className="space-x-4 mt-6">
            <Link to={"/courses"} className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-black transition">
              Explore Courses
            </Link>
            <Link to={"/"} className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 hover:text-white transition">
              Course Videos
            </Link>
          </div>

          {/* Slider Section */}
          <section className="mt-10">
            <Slider {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="relative flex-shrink-0 w-64 transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                      <img className="h-40 w-full object-cover" src={course.image.url} alt={course.title} />
                      <div className="p-4 text-center">
                        <h2 className="text-lg font-bold text-white">{course.title}</h2>
                        <button className="mt-3 bg-orange-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-500 hover:text-black transition duration-300">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        </main>

        <hr className="mt-10 border-gray-600" />

        {/* Footer */}
        <footer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2.5">
              <img src={Logo} alt="CourseHaven Logo" className="w-16 h-16 rounded-full border-2 border-orange-500" />
              <h1 className="text-2xl text-orange-500 font-bold">CodeSprint</h1>
            </div>
            <div className="mt-3">
              <p className="mb-2">Follow us</p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/share/161QWjd8NF/" aria-label="Facebook" className="text-2xl hover:text-blue-400 duration-200"><FaFacebook /></a>
                <a href="https://www.instagram.com/saurabh_tiwari1463?igsh=MXRzYXkzZGduNHVlYQ==" aria-label="Instagram" className="text-2xl hover:text-pink-400 duration-200"><FaInstagram /></a>
                <a href="https://www.linkedin.com/in/saurabh-tiwari-769323237?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" aria-label="Linkedin" className="text-2xl hover:text-blue-400 duration-200"><FaLinkedin/></a>
              </div>
            </div>
          </div>
          <div className="items-center flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Connects</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">YouTube - Saurabh Tiwari</li>
              <li className="hover:text-white cursor-pointer duration-300">Linkedin - Saurabh Tiwari</li>
              <li className="hover:text-white cursor-pointer duration-300">GitHub - Saurabh Tiwari</li>
            </ul>
          </div>
          <div className="items-center flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Copyrights &#169; 2025</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer duration-300">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer duration-300">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer duration-300">Refund & Cancellation</li>
            </ul>
            <div className="col-span-1 md:col-span-3 text-center mt-6 text-gray-400">
        Made with <span className="text-red-500">❤️</span> by <span className="text-orange-500 font-bold">SAURABH</span>
      </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
