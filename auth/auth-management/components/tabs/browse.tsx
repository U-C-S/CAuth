import { useEffect, useState } from "react";
import { Table, Checkbox, ScrollArea, Title, Paper } from "@mantine/core";
import { getAllServices } from "../../data/getServices";
import { ProtectedPage } from "../contexts/authContext";

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

export function BrowseTab() {
  let [data, setData] = useState([]);

  useEffect(() => {
    getAllServices().then((res) => setData(res?.data));
  }, []);

  console.log(data);

  return (
    <ProtectedPage>
      <Title order={2} align="center" mb={"md"}>
        Browse All the Available Services
      </Title>
      <Paper withBorder>
        <TableSelection data={data} />
      </Paper>
    </ProtectedPage>
  );
}
