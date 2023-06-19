import { use, useContext, useEffect, useState } from "react";
import {
  createStyles,
  Container,
  Tabs,
  rem,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Card,
  Title,
  Button,
  Divider,
  Drawer,
  TextInput,
  Textarea,
  MultiSelect,
  Center,
  Select,
  ActionIcon,
} from "@mantine/core";
import { AuthContext, ProtectedPage } from "../../components/contexts/authContext";
import PAGE_DATA from "../../data/page_data";
import { IconCopy, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { BrowseTab } from "../../components/tabs/browse";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
    marginBottom: rem(120),
  },

  tab: {
    fontWeight: 500,
    fontSize: rem(18),
    height: rem(38),
  },

  panel: {
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));

function OwnedTab() {
  let [appsList, setAppsList] = useState([]);
  let [servicesList, setServicesList] = useState([]);
  const [sopened, { open: sopen, close: sclose }] = useDisclosure(false);
  const [aopened, { open: aopen, close: aclose }] = useDisclosure(false);

  const serviceForm = useForm({
    initialValues: {
      service_name: "",
      description: "",
      api_base_uri: "",
    },
  });

  const appForm = useForm({
    initialValues: {
      app_name: "",
      description: "",
    },
  });

  useEffect(() => {
    let appReq = fetch("http://localhost:3100/manage/get/all_owned_apps", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    let serviceReq = fetch("http://localhost:3100/manage/get/all_owned_services", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());

    Promise.all([appReq, serviceReq]).then((res) => {
      setAppsList(res[0].data);
      setServicesList(res[1].data);
    });
  }, []);

  const createNewService = async (values: {
    service_name: string;
    description: string;
    api_base_uri: string;
  }) => {
    let res = await fetch("http://localhost:3100/manage/create/service", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (res.success) {
      setServicesList([...servicesList, res.data]);
    }
  };

  const createNewApp = async (values: { app_name: string; description: string }) => {
    let res = await fetch("http://localhost:3100/manage/create/app", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    if (res.success) {
      setAppsList([...appsList, res.data]);
    }
  };

  return (
    <Group position="apart" align="start" px={10}>
      <Paper withBorder w={"48%"} p={5}>
        <Group position="apart" p={5}>
          <Title order={3}>Your Services</Title>
          <Button leftIcon={<IconPlus />} onClick={sopen}>
            New
          </Button>
        </Group>
        <ScrollArea mah={"80vh"}>
          <Stack p={5}>
            {servicesList.map((service) => (
              <Card>
                <Title order={3}>{service.service_name}</Title>
                <Text>{service.description}</Text>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Paper>

      <Paper withBorder w={"48%"} p={5}>
        <Group position="apart" p={5}>
          <Title order={3}>Your Apps</Title>
          <Button leftIcon={<IconPlus />} onClick={aopen}>
            New
          </Button>
        </Group>
        <ScrollArea mah={"80vh"}>
          <Stack p={5}>
            {appsList.map((app) => (
              <Card>
                <Title order={3}>{app.app_name}</Title>
                <Text>{app.description}</Text>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Paper>

      <Drawer
        position="left"
        size={500}
        opened={sopened}
        onClose={sclose}
        title="Create New Service">
        <form onSubmit={serviceForm.onSubmit((v) => createNewService(v))}>
          <Stack p={5}>
            <TextInput
              required
              label="Service Name"
              {...serviceForm.getInputProps("service_name")}
            />
            <Textarea label="Description" {...serviceForm.getInputProps("description")} />
            <TextInput
              required
              label="API Base URI"
              {...serviceForm.getInputProps("api_base_uri")}
            />

            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Drawer>

      <Drawer position="right" size={500} opened={aopened} onClose={aclose} title="Create New App">
        <form onSubmit={appForm.onSubmit((v) => createNewApp(v))}>
          <Stack p={5}>
            <TextInput required label="App Name" {...appForm.getInputProps("app_name")} />
            <Textarea label="Description" {...appForm.getInputProps("description")} />
            <MultiSelect
              label="Choose Service to be linked"
              data={[
                { label: "Info API", value: "service_1" },
                { label: "Auth API", value: "service_2" },
                { label: "Payment API", value: "service_3" },
              ]}
            />

            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Drawer>
    </Group>
  );
}

function AccessTokensTab() {
  const [ownedAppList, setAppList] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const clipboard = useClipboard();

  useEffect(() => {
    fetch("http://localhost:3100/manage/get/all_owned_apps", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res.data.map((app: any) => app.app_name as string);
        setAppList(res.data);
      });
  }, []);

  const generateAccessToken = async () => {
    if (!selectedApp) {
      return;
    }
    let appid = ownedAppList?.find((app: any) => app.app_name === selectedApp).id;
    let x = await fetch("http://localhost:3100/manage/get/app_access_token?appid=" + appid, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    let res = await x.json();

    if (res.success) {
      setAccessToken(res.data.token);
    } else {
      setAccessToken("Error");
    }
  };

  return (
    <Center>
      <Stack>
        <Title order={3} w={500} align="center">
          Generate Access Tokens for your Application to access the Services associated to it
        </Title>

        <Paper withBorder w={500} p={5}>
          <Stack spacing={"lg"} align="center" py={10}>
            <Select
              label="Choose App"
              data={ownedAppList.map((app: any) => app.app_name as string)}
              w={"90%"}
              value={selectedApp}
              onChange={setSelectedApp}
            />
            <Button w={250} onClick={() => generateAccessToken()}>
              Generate Access Token
            </Button>
            <Divider w={"100%"} />

            <Textarea
              placeholder="Your Generated Access Token should appear here"
              w={"90%"}
              rows={10}
              value={accessToken}
              rightSection={
                <ActionIcon onClick={() => clipboard.copy(accessToken)}>
                  <IconCopy />
                </ActionIcon>
              }
            />
          </Stack>
        </Paper>
      </Stack>
    </Center>
  );
}

function NewLayout() {
  const router = useRouter();
  const { authData } = useContext(AuthContext);
  const { classes } = useStyles();

  let tabs = PAGE_DATA.map((page) => page.label);

  const user = {
    name: (authData?.user_name as string) || "User",
  };

  return (
    <div className={classes.header}>
      <Container>
        <Tabs
          defaultValue="Browse"
          value={router.query.activeTab as string}
          onTabChange={(value) => router.push(`/dashboard/${value}`)}
          classNames={{
            tab: classes.tab,
            panel: classes.panel,
          }}>
          <Tabs.List>
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
            <Tabs.Tab value="owned">Owned</Tabs.Tab>
            <Tabs.Tab value="access_tokens">Access Tokens</Tabs.Tab>
            <Tabs.Tab value={user?.name} ml={"auto"}>
              {user?.name}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="browse">
            <BrowseTab />
          </Tabs.Panel>
          <Tabs.Panel value="owned">
            <OwnedTab />
          </Tabs.Panel>
          <Tabs.Panel value="access_tokens">
            <AccessTokensTab />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedPage>
      <NewLayout />
    </ProtectedPage>
  );
}
