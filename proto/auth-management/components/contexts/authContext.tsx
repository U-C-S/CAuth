import React, { createContext, useEffect, useState } from "react";

type authData = {
  userName: string;
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
    const userName = localStorage.getItem("userName");
    if (token && userName) {
      setAuthInfo({ userName, token });
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
