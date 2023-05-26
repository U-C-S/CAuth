import { Layout } from "../../components/common/Layout";

import { useEffect, useState } from "react";
import { Table, Checkbox, ScrollArea } from "@mantine/core";
import getAllServices from "../../data/getAllServices";

interface TableSelectionProps {
  data: { name: string; description: string; owner: string; api: string }[];
}

function TableSelection({ data }: TableSelectionProps) {
  const rows = data.map((item) => {
    return (
      <tr key={item.name}>
        <td>
          <Checkbox />
        </td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.owner}</td>
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
    getAllServices().then((res) => setData(res));
  }, []);

  console.log(data);

  return (
    <Layout>
      <h1>Browse</h1>
      <TableSelection data={data} />
    </Layout>
  );
}
