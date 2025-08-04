import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const usersDB = [
    { username: "user1", password: "password1" },
    { username: "user2", password: "password2" },
  ];

  const login = (username, password) => {
    const matchedUser = usersDB.find(
      (u) => u.username === username && u.password === password
    );
    if (matchedUser) {
      setUser({ username: matchedUser.username });
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
