import {
  AppShell,
  Navbar,
  Group,
  createStyles,
  rem,
  UnstyledButton,
  Avatar,
  Text,
  Box,
  ThemeIcon,
} from "@mantine/core";
import {
  IconGauge,
  IconChevronRight,
  IconKey,
  IconApps,
  IconApi,
  IconApiApp,
} from "@tabler/icons-react";

interface IComponentProps {
  children: React.ReactNode;
}

const mockdata = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Browse",
    icon: IconApps,
    initiallyOpened: true,
  },
  {
    label: "Your Services",
    icon: IconApi,
  },
  {
    label: "Your Applications",
    icon: IconApiApp,
  },
  {
    label: "Access Keys",
    icon: IconKey,
  },
];

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },

  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function TheAppNavbar() {
  const { classes } = useStyles();
  const links = mockdata.map((item: LinksGroupProps) => {
    return (
      <UnstyledButton className={classes.control}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThemeIcon variant="light" size={30}>
            <item.icon size="1rem" />
          </ThemeIcon>
          <Box ml="md">{item.label}</Box>
        </Box>
      </UnstyledButton>
    );
  });

  return (
    <Navbar width={{ sm: 300 }} px="md" className={classes.navbar}>
      <Navbar.Section>CAuth</Navbar.Section>

      <Navbar.Section grow className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              src={
                "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
              }
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                Random Idiot
              </Text>

              <Text color="dimmed" size="xs">
                anullpointer@yahoo.com
              </Text>
            </div>

            <IconChevronRight size="0.9rem" stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}

function Layout({ children }: IComponentProps) {
  return <AppShell navbar={<TheAppNavbar />}>{children}</AppShell>;
}

export { Layout };
