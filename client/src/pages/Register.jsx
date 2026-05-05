// client/src/pages/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  //  FIXED GOOGLE REGISTER
  const handleGoogle = async (res) => {
    try {
      const { data } = await API.post("/auth/google", {
        token: res.credential,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Google signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
      <div className="bg-[#181818] p-8 rounded-xl w-96">
        <h2 className="text-xl mb-4 font-semibold">Register</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            placeholder="Username"
            className="p-2 bg-[#121212] border border-[#303030]"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            placeholder="Email"
            className="p-2 bg-[#121212] border border-[#303030]"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-2 bg-[#121212] border border-[#303030]"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="bg-red-500 p-2 rounded">Register</button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogle} onError={() => alert("Failed")} />
        </div>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}