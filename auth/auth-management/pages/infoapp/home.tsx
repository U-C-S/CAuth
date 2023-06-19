import { Button, Center, Group, Input, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import Router from "next/router";
import { useEffect } from "react";

export default function Page() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      dob: new Date(),
      about: "",
    },
  });

  useEffect(() => {
    let userToken = localStorage.getItem("info_loggedin_token");
    if (!userToken) {
      Router.push("/infoapp");
      return;
    }

    let x = async () => {
      let req = await fetch("http://localhost:4000/api/info", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      });
      let res = await req.json();
      if (req.status !== 200) {
        alert("Error");
      }

      form.setValues(res);
    };
    x();
  }, []);

  const handleSubmit = async (values: any) => {
    let req = await fetch("http://localhost:4000/api/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("info_loggedin_token"),
      },
      body: JSON.stringify(values),
    });
  };

  function handleLogout() {
    localStorage.removeItem("info_loggedin_token");
    Router.push("/infoapp");
  }

  return (
    <Center>
      <Stack>
        <Title order={2} align="center">
          Info App/API Demo
        </Title>
        <Paper withBorder p={"md"}>
          <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
            <Stack>
              <TextInput label="Name" {...form.getInputProps("name")} />
              <TextInput label="Email" {...form.getInputProps("email")} />
              {/* <Input type="date" {...form.getInputProps("dob")} /> */}
              <TextInput label="About" {...form.getInputProps("about")} />
              <Group>
                <Button type="submit">Save</Button>
                <Button onClick={handleLogout}>Logout</Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Center>
  );
}
