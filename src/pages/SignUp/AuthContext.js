import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ userId: null, role: null });

  useEffect(() => {
    fetch("http://localhost:5000/web/api/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setAuth({ userId: data.userId, role: data.role });
        }
      });
  }, []);

  const login = (userId, role) => {
    setAuth({ userId, role });
  };

  const logout = () => {
    fetch("http://localhost:5000/web/api/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => setAuth({ userId: null, role: null }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
