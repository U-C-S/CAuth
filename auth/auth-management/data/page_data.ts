import { IconApi, IconApiApp, IconApps, IconGauge, IconKey } from "@tabler/icons-react";

const PAGE_DATA = [
  {
    label: "Your Apps",
    icon: IconApiApp,
    link: "/dashboard",
  },
  {
    label: "Your Services",
    icon: IconApi,
    link: "/dashboard/services",
  },
  {
    label: "Browse",
    icon: IconApps,
    link: "/dashboard/browse",
  },
  {
    label: "Access Keys",
    icon: IconKey,
    link: "/dashboard/access-keys",
  },
];

export default PAGE_DATA;
