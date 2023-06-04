import React, { createContext, useEffect, useState } from "react";

type authData = {
  user_name: string;
  token: string;
} | null;

type IAuthContext = {
  authData: authData;
  setAuth: React.Dispatch<React.SetStateAction<authData>>;
};

const defaultAuthContext: IAuthContext = {
  authData: null,
  setAuth: () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [authInfo, setAuthInfo] = useState<authData>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_name = localStorage.getItem("userName");
    if (token && user_name) {
      setAuthInfo({ user_name, token });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData: authInfo,
        setAuth: setAuthInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
