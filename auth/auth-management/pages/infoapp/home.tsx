import { Group } from "@mantine/core";
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
  const [userToken] = useLocalStorage({
    key: "info_loggedin_token",
    defaultValue: null,
  });

  useEffect(() => {
    if (!userToken) {
      Router.push("/infoapp/auth");
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
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify(values),
    });
  };

  function handleLogout() {
    localStorage.removeItem("info_loggedin_token");
    Router.push("/infoapp/auth");
  }

  return (
    <div className="details-page-container">
      <h1>Details Page</h1>
      <form onSubmit={form.onSubmit((v) => handleSubmit(v))}>
        <input type="text" placeholder="Name" {...form.getInputProps("name")} />
        <br />
        <input type="text" placeholder="Occupation" {...form.getInputProps("email")} />
        <br />
        <input type="date" placeholder="Age" {...form.getInputProps("dob")} />
        <br />
        <input type="text" placeholder="About" {...form.getInputProps("about")} />
        <Group>
          <button type="submit">Save</button>
          <button onClick={handleLogout}>Logout</button>
        </Group>
      </form>
    </div>
  );
}
