import { Layout } from "../../components/common/Layout";

import { useEffect, useState } from "react";
import { Table, Checkbox, ScrollArea } from "@mantine/core";
import { getAllServices } from "../../data/getServices";
import { ProtectedPage } from "../../components/contexts/authContext";

interface TableSelectionProps {
  data: {
    service_name: string;
    description: string;
    api: string;
    Provider: {
      user_name: string;
    };
  }[];
}

function TableSelection({ data }: TableSelectionProps) {
  const rows = data.map((item) => {
    return (
      <tr key={item.service_name}>
        <td>
          <Checkbox />
        </td>
        <td>{item.service_name}</td>
        <td>{item.description}</td>
        <td>{item.Provider.user_name}</td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th></th>
            <th>Service Name</th>
            <th>Description</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default function Page() {
  let [data, setData] = useState([]);

  useEffect(() => {
    getAllServices().then((res) => setData(res?.data));
  }, []);

  console.log(data);

  return (
    <ProtectedPage>
      <Layout>
        <h1>Browse</h1>
        <TableSelection data={data} />
      </Layout>
    </ProtectedPage>
  );
}
