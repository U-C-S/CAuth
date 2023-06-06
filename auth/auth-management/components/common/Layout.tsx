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
import { IconChevronRight, IconUser } from "@tabler/icons-react";
import PAGE_DATA from "../../data/page_data";
import Router from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

interface IComponentProps {
  children: React.ReactNode;
}

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

export function TheAppNavbar() {
  const { classes } = useStyles();
  const { authData } = useContext(AuthContext);

  const links = PAGE_DATA.map((item) => {
    return (
      <Link href={item.link} key={item.label} style={{ textDecoration: "none" }}>
        <UnstyledButton className={classes.control}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <item.icon size="1rem" />
            </ThemeIcon>
            <Box ml="md">{item.label}</Box>
          </Box>
        </UnstyledButton>
      </Link>
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
          <Group align="center" position="apart">
            <Group>
              <IconUser size="1.5rem" />

              <Text size="xl">{authData?.user_name}</Text>
            </Group>

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
