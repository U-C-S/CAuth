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
} from "@mantine/core";
import { AuthContext, ProtectedPage } from "../../components/contexts/authContext";
import PAGE_DATA from "../../data/page_data";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

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

  const createNewService = async (values) => {
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

  const createNewApp = async (values) => {
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
    <Group position="apart">
      <Paper withBorder w={"48%"} p={5}>
        <Group position="apart" p={5}>
          <Title order={3}>Your Services</Title>
          <Button leftIcon={<IconPlus />} onClick={() => createNewService()}>
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
          <Button leftIcon={<IconPlus />} onClick={() => createNewApp()}>
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

      <Drawer position="left" size={500} opened={false} onClose={close} title="Create New Service">
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

      <Drawer position="right" size={500} opened={false} onClose={close} title="Create New App">
        <form onSubmit={appForm.onSubmit((v) => createApp(v))}>
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
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    
  }, []);
  return (
    <Center>
      <Group position="apart">
        <Title order={3}>Access Tokens</Title>
        <Button leftIcon={<IconPlus />}>New</Button>
      </Group>
      <Stack>
        {

        }
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
            tabsList: classes.tabsList,
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

          <Tabs.Panel value="browse">Browse</Tabs.Panel>
          <Tabs.Panel value="owned">
            <OwnedTab />
          </Tabs.Panel>
          <Tabs.Panel value="access_tokens">Access Tokens</Tabs.Panel>
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
