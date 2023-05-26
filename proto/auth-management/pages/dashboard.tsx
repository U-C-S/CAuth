import { AppShell, Text } from "@mantine/core";
import { TheAppNavbar } from "../components/NavBar";

export default function Page() {
  return (
    <AppShell navbar={<TheAppNavbar />}>
      <Text>Dashboard</Text>
    </AppShell>
  );
}
