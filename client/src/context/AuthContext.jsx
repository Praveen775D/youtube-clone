// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  /* ================= LOGIN ================= */
  const login = (data) => {
    // ✅ backend sends: token + user fields
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ================= CUSTOM HOOK ================= */
export const useAuth = () => useContext(AuthContext);