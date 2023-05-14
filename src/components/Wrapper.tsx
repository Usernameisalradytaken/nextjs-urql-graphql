import { Box } from "@chakra-ui/react";
import React from "react";
import { PropsWithChildren } from "react";

function Wrapper(props: PropsWithChildren) {
  return (
    <Box maxW="800px" w={"100%"} mx={"auto"}>
      {props.children}
    </Box>
  );
}

export default Wrapper;
