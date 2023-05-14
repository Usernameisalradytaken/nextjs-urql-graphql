import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import createUrqlClient from "@/util/urqlClient";
import { Button } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

function Index() {
  return (
    <>
      <Wrapper>
        <NavBar />
      </Wrapper>
    </>
  );
}

export default withUrqlClient(createUrqlClient)(Index);
