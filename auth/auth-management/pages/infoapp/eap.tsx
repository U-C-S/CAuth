import { Button, Card, Center, Loader, Paper, Progress, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
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
          window.location.href = `${redirect_uri}?token=${res.token}`;
        } else {
          setParams({ redirect_uri, appid, scope });
        }
      });
  }, []);

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
  };

  return (
    <Center w={"100vw"} h={"100vh"}>
      {params ? (
        <Stack>
          <Title order={2} align="center">
            Authorize
          </Title>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack>
              <Card>
                
                {/* <Text>{`${params.appName} by ${params.appOwnerName}`}</Text>
                <Text>{`wants to access your following info from ${params.serviceName}`}</Text> */}
              </Card>
              <Text>{params.scope}</Text>
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
