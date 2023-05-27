import { IconApi, IconApiApp, IconApps, IconGauge, IconKey } from "@tabler/icons-react";

const PAGE_DATA = [
  {
    label: "Dashboard",
    icon: IconGauge,
    link: "/dashboard",
  },
  {
    label: "Browse",
    icon: IconApps,
    link: "/dashboard/browse",
  },
  {
    label: "Your Services",
    icon: IconApi,
    link: "/dashboard/services",
  },
  {
    label: "Your Apps",
    icon: IconApiApp,
    link: "/dashboard/applications",
  },
  {
    label: "Access Keys",
    icon: IconKey,
    link: "/dashboard/access-keys",
  },
];

export default PAGE_DATA;
