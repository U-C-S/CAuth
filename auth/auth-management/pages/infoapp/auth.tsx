import { Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import Router from "next/router";

export default function Page() {
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const registerForm = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (isRegister: boolean, values: any) => {
    let url = isRegister ? "/api/auth/register" : "/api/auth/login";
    let x = await fetch("http://localhost:4000" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    let res = await x.json();

    if (res.token) {
      localStorage.setItem("info_loggedin_token", res.token);
      Router.push("/infoapp/home");
    } else {
      alert("Error: " + res.message);
    }
  };

  return (
    <div className="login-container">
      <Paper withBorder>
        <h1>Login</h1>
        <form onSubmit={loginForm.onSubmit((v) => handleSubmit(false, v))}>
          <input type="email" placeholder="Email" {...loginForm.getInputProps("email")} />
          <input type="password" placeholder="Password" {...loginForm.getInputProps("password")} />
          <button type="submit">Login</button>
        </form>
      </Paper>

      <Paper withBorder>
        <h1>Register</h1>
        <form onSubmit={registerForm.onSubmit((v) => handleSubmit(true, v))}>
          <input type="text" placeholder="name" required {...registerForm.getInputProps("name")} />
          <input
            type="email"
            placeholder="name"
            required
            {...registerForm.getInputProps("email")}
          />
          <input
            type="password"
            placeholder="Password"
            required
            {...registerForm.getInputProps("password")}
          />
          <button type="submit">Login</button>
        </form>
      </Paper>
    </div>
  );
}
