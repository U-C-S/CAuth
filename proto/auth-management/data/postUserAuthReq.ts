const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function LoginReq(user_name: string, password: string) {
  let req = await fetch(API_URL + "/manage/auth/login", {
    method: "POST",
    body: JSON.stringify({ user_name, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let res = await req.json();

  return res as { token: string; user_name: string };
}

export { LoginReq };
