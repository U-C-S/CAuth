import { Button, Divider, Flex, Group } from "@mantine/core";
import { Layout } from "../../components/common/Layout";
import { ProtectedPage } from "../../components/contexts/authContext";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { IOwnedService, getAllOwnedServices } from "../../data/getServices";

export default function Page() {
  let [data, setData] = useState<IOwnedService[] | null>(null);

  useEffect(() => {
    getAllOwnedServices().then((res) => setData(res?.data));
  }, []);

  return (
    <ProtectedPage>
      <Layout>
        <Group position="apart">
          <h1>Your Services</h1>
          <Button leftIcon={<IconPlus />}>New</Button>
        </Group>

        <Divider />

        <Flex wrap={"wrap"}>
          {data.map((item) => (
            <div key={item?.service_name} style={{ width: "30%", margin: "1rem" }}>
              <h3>{item?.service_name}</h3>
              <p>{item?.description}</p>
            </div>
          ))}
        </Flex>
      </Layout>
    </ProtectedPage>
  );
}
