import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ProtectedPage } from "../contexts/authContext";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { IOwnedService, createService, getAllOwnedServices } from "../../data/getServices";
import { useDisclosure } from "@mantine/hooks";

export function OwnedTab() {
  const [data, setData] = useState<IOwnedService[] | null>(null);
  const [selectedService, setSelectedService] = useState<IOwnedService | null>(null); // [1
  const [isNewOpened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    getAllOwnedServices().then((res) => setData(res?.data));
  }, []);

  const createNewService = async () => {
    let res = await createService({
      service_name: "New Service",
      description: "New Service Description",
      api_base_uri: process.env.NEXT_PUBLIC_API_URL + "/check",
    });

    if (res.success) {
      setData((prev) => {
        if (prev === null) prev = [];
        prev?.push(res.data as IOwnedService);
        return prev;
      });
    }
  };

  return (
    <ProtectedPage>
      {selectedService ? (
        <div>
          <Group position="apart">
            <h1>{selectedService.service_name}</h1>
            <Badge>ServiceId: {selectedService.id}</Badge>
          </Group>

          <Paper withBorder>
            <Stack></Stack>
          </Paper>
        </div>
      ) : (
        <>
          <Group position="apart">
            <h1>Your Services</h1>
            <Button leftIcon={<IconPlus />} onClick={() => createNewService()}>
              New
            </Button>
          </Group>

          <Divider />

          <Flex wrap={"wrap"} py={15}>
            {data?.map((item) => (
              <Card key={item.id} w={280} h={280}>
                <Stack spacing={"md"}>
                  <Title order={3}>{item?.service_name}</Title>
                  <Divider />
                  <Text>URI: {item.api_base_uri}</Text>
                  <Text>{item?.description}</Text>
                </Stack>
              </Card>
            ))}
          </Flex>
        </>
      )}
    </ProtectedPage>
  );
}
