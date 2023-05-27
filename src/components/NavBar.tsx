import { useLogoutMutation, useMeQuery } from "@/generated/generated";
import { isServer } from "@/util/isServer";
import createUrqlClient from "@/util/urqlClient";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { initUrqlClient, withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface navbarProps {}

const NavBar: React.FC = (props) => {
  const [{ fetching, data }] = useMeQuery();
  console.log("data-----------------from navbar", data);

  const [, logoutFunc] = useLogoutMutation();
  const handleLogout = () => {
    logoutFunc({});
  };

  let navData;
  if (fetching) {
    navData = null;
  } else if (!data?.me) {
    navData = (
      <Flex justifyContent={"flex-end"}>
        <Box>
          <Link href={"/login"}>Login</Link>
        </Box>
        <Box ml={2}>
          <Link href={"/register"}>Register</Link>
        </Box>
      </Flex>
    );
  } else {
    navData = (
      <Flex justifyContent={"flex-end"}>
        <Box>
          <Link href={"/"}>{data.me.username}</Link>
        </Box>
        <Box ml={2}>
          <Link href={"/"} onClick={handleLogout}>
            Log Out
          </Link>
        </Box>
      </Flex>
    );
  }

  return (
    <Box
      display={"flex"}
      padding={3}
      bgColor={"blackAlpha.500"}
      alignItems={"center"}
      p={6}
    >
      <Link href={"/"}>
      <Heading>Lite Reddit</Heading>
      </Link>
      <Box ml={"auto"}>{navData}</Box>
    </Box>
  );
};

export default NavBar;
