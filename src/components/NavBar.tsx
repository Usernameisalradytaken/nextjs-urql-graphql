import { useIsLoggedInQuery, useLogoutMutation } from "@/generated/generated";
import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface navbarProps {}

const NavBar: React.FC = (props) => {
  const [{ fetching, data, stale: staleLoggedInUser, error }] =
    useIsLoggedInQuery();
  // const [{ fetching: logoutFetching, stale, data: loginData }, logoutFunc] =
  //   useLogoutMutation();
  const router = useRouter();
  const handleLogout = () => {
    // logoutFunc({});
  };

  // useEffect(() => {
  //   isLoggedIn()
  // },[])

  let navData;
  if (fetching) {
    navData = null;
  } else if (
    data?.isLoggedIn.isLogged?.is &&
    data?.isLoggedIn.isLogged?.is == true
  ) {
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

  console.log("---------------", navData, data, fetching);
  return (
    // bgColor={"blackAlpha.400"}
    <Box padding={3} bgColor={"blackAlpha.300"}>
      {navData}
    </Box>
  );
};

export default NavBar;
