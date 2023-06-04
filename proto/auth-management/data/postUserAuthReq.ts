const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginReqProps {
  user_name: string;
  password: string;
}
interface RegisterReqProps extends LoginReqProps {
  email: string;
}

async function LoginReq({ user_name, password }: LoginReqProps) {
  let req = await fetch(API_URL + "/auth/login", {
    method: "POST",
    body: JSON.stringify({ user_name, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let res = await req.json();

  return res as { data: { token: string; user_name: string }; success: boolean };
}

async function RegisterReq({ user_name, password, email }: RegisterReqProps) {
  let req = await fetch(API_URL + "/auth/register", {
    method: "POST",
    body: JSON.stringify({ user_name, password, email }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let res = await req.json();

  return res as { data: { token: string; user_name: string }; success: boolean };
}

export { LoginReq, RegisterReq };
