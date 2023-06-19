import { Button, Divider, Group, Paper, Stack, TextInput, Title } from "@mantine/core";
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
    let url = isRegister ? "/register" : "/login";
    let x = await fetch("http://localhost:4000/api/auth" + url, {
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
    <Group align="flex-start" mx={"auto"} mt={40} w={500}>
      <Paper withBorder>
        <Title order={2} align="center">
          Login
        </Title>
        <Divider />
        <form onSubmit={loginForm.onSubmit((v) => handleSubmit(false, v))}>
          <Stack px={15} py={5}>
            <TextInput
              required
              type="email"
              placeholder="Email"
              {...loginForm.getInputProps("email")}
            />
            <TextInput
              required
              type="password"
              placeholder="Password"
              {...loginForm.getInputProps("password")}
            />
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </Paper>

      <Paper withBorder>
        <Title order={2} align="center">
          Register
        </Title>
        <Divider />
        <form onSubmit={registerForm.onSubmit((v) => handleSubmit(true, v))}>
          <Stack px={15} py={5}>
            <TextInput
              type="text"
              placeholder="name"
              required
              {...registerForm.getInputProps("name")}
            />
            <TextInput
              type="email"
              placeholder="email"
              required
              {...registerForm.getInputProps("email")}
            />
            <TextInput
              type="password"
              placeholder="Password"
              required
              {...registerForm.getInputProps("password")}
            />
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </Paper>
    </Group>
  );
}
