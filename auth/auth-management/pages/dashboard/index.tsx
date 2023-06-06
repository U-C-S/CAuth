import { Layout } from "../../components/common/Layout";
import { ProtectedPage } from "../../components/contexts/authContext";

export default function Page() {
  return (
    <ProtectedPage>
      <Layout>
        <h1>Dashboard</h1>
      </Layout>
    </ProtectedPage>
  );
}