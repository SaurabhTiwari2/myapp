import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Token extraction & validation
  const userData = localStorage.getItem("user");
  let token = null;

  try {
    token = userData ? JSON.parse(userData).token : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user"); // Corrupt data remove karo
    token = null;
  }

  console.log("Extracted Token:", token); // Debugging ke liye

  // ✅ Agar token nahi hai toh login page pe bhej do
  if (!token) {
    toast.error("Session expired, please login again!");
    navigate("/login");
  }

  const handlePurchase = async () => {
    if (!token) {
      toast.error("Please login to purchase the course");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(data.message || "Course purchased successfully");
      navigate("/purchases");
    } catch (error) {
      console.error("Purchase Error:", error.response?.data || error.message);
      
      if (error.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors || "Error processing purchase");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}

export default Buy;
