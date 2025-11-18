import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) fetchUserFromToken(token);
  }, []);

  const fetchUserFromToken = async (token) => {
    if(!token) return;
    try {
      const response = await fetch(`http://localhost:8080/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          credentials: 'include', // ✅ important
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);

        setUser(data);
      } else {
        Cookies.remove("jwt");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      Cookies.remove("jwt");
      setUser(null);
    }
  };

  // ✅ Login function: stores user & JWT
  const login = async (userData, token) => {
    Cookies.set("jwt", token, { expires: 10, path: "/" });
    setUser(userData);
  };

  // ✅ Logout function
  const logout = () => {
    Cookies.remove("jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
