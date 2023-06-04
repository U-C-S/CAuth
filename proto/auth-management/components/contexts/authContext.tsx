import React, { createContext, useEffect, useState } from "react";

type authData = {
  user_name: string;
  token: string;
} | null;

type IAuthContext = {
  authData: authData;
  // setAuth: React.Dispatch<React.SetStateAction<authData>>;
};

const defaultAuthContext: IAuthContext = {
  authData: null,
  // setAuth: () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<authData>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_name = localStorage.getItem("user_name");
    if (token && user_name) {
      setAuthData({ user_name, token });
    }
  }, []);
  // console.log(authData);

  return (
    <AuthContext.Provider
      value={{
        authData,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
