// client/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /*   LOGIN   */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", form);

      //  FIXED KEY
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /*   GOOGLE LOGIN   */
  const handleGoogle = async (res) => {
    try {
      if (!res.credential) {
        return alert("No Google token received");
      }

      const { data } = await API.post("/auth/google", {
        token: res.credential,
      });

      //  FIXED KEY
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
      <div className="bg-[#181818] p-8 rounded-xl w-96">
        <h2 className="text-xl mb-4 font-semibold">Sign In</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            placeholder="Email"
            className="p-2 bg-[#121212] border border-[#303030]"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="p-2 bg-[#121212] border border-[#303030]"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="bg-red-500 p-2 rounded">
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">OR</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => alert("Google failed")}
          />
        </div>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}