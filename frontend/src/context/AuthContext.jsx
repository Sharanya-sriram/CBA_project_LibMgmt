import React, { createContext, useState,useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const usersDB = [
    { username: "user1", password: "password1",role:"admin",id:'1' },
    { username: "user2", password: "password2" ,role:"user",id:'2'},
  ];
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  }
  const login = (username, password) => {
    const matchedUser = usersDB.find(
      (u) => u.username === username && u.password === password
    );
    if (matchedUser) {
      setUser({ username: matchedUser.username,role:matchedUser.role });
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,darkMode,toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);