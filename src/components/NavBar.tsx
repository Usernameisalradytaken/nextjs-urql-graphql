import { useIsLoggedInQuery, useLogoutQuery } from "@/generated/generated";
import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface navbarProps {}

const NavBar: React.FC = (props) => {
  const [{ fetching, data, error }, loginMeIn] = useIsLoggedInQuery();
  const [{ fetching: logoutFetching, stale,data : loginData }, logoutFunc] = useLogoutQuery({
    pause: true,
  });
  const router = useRouter();
  const handleLogout = () => {
    logoutFunc();
    console.log(window.location);
    // router.refresh()
    // router.push({ pathname : '/' }, undefined ,{shallow: false})
  };

  useEffect(() => {
    loginMeIn()
  }, [logoutFetching, stale,loginData]);

  let navData;
  if (fetching) {
    navData = null;
  } else if (data?.isLoggedIn.isLogged?.is === true) {
    navData = (
      <Flex justifyContent={"flex-end"}>
        <Box>
          <Link href={"/"}>{data.isLoggedIn.isLogged.username}</Link>
        </Box>
        <Box ml={2}>
          <Link href={"/"} onClick={handleLogout}>
            Log Out
          </Link>
        </Box>
      </Flex>
    );
  } else {
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
  }

  return (
    // bgColor={"blackAlpha.400"}
    <Box padding={3} bgColor={"blackAlpha.300"}>
      {navData}
    </Box>
  );
};

export default NavBar;
