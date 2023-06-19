import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface EAP_Data {
  appName: string;
  appOwnerName: string;
  serviceName: string;
  permissions: string[];
}

export default function Page() {
  let [params, setParams] = useState<{
    redirect_uri: string;
    appid: number;
    scope: string | null;
  } | null>(null);

  useEffect(() => {
    let searchParams = new URLSearchParams(window.location.search);
    let redirect_uri = searchParams.get("redirect_uri") as string;
    let appid = parseInt(searchParams.get("appid") ?? "0");
    let scope = searchParams.get("scope");

    let req = fetch("http://localhost:4000/api/checkappaccess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("info_loggedin_token"),
      },
      body: JSON.stringify({
        appid,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          window.location.href = `${redirect_uri}?token=${res.eaptoken}`;
        } else {
          setParams({ redirect_uri, appid, scope, ...res.app_data });
        }
      });
  }, []);
  console.log(params);

  // let x: EAP_Data = {
  //   appName: "GuestApp",
  //   appOwnerName: "GuestAppOwner",
  //   serviceName: "YourAppXAccount",
  //   permissions: ["Email", "Phone", "Local Storage"],
  // };

  const AuthorizeBtn = async () => {
    let req = await fetch("http://localhost:4000/api/accesstokengenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("info_loggedin_token"),
      },
      body: JSON.stringify({
        appid: params?.appid,
        scope: params?.scope,
      }),
    });
    let res = await req.json();
    if (res.eaptoken) {
      window.location.href = `${params?.redirect_uri}?token=${res.eaptoken}`;
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <Center w={"100vw"} h={"100vh"}>
      {params ? (
        <Stack>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack>
              <Card>
                <Text>{`${params?.data.app_name} by ${params?.data?.Owner.user_name}`}</Text>
                <Text>{`wants to access your following info from this Service`}</Text>
              </Card>
              <Group position="center">
                {params.scope?.split(" ").map((scope) => (
                  <Badge>{scope}</Badge>
                ))}
              </Group>
              <Divider />
              <Button onClick={() => AuthorizeBtn()}>Authorize</Button>
            </Stack>
          </Paper>
        </Stack>
      ) : (
        <Loader />
      )}
    </Center>
  );
}
