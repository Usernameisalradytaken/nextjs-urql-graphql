import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import { useGetPostQuery, useGetPostsQuery } from "@/generated/generated";
import createUrqlClient from "@/util/urqlClient";
import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const postID =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = useGetPostQuery({
    pause: postID == -1,
    variables: {
      id: postID,
    },
  });
  console.log(data, fetching);

  if (fetching) {
    return (
      <Wrapper>
        <h1>Loading...</h1>
      </Wrapper>
    );
  }

  if(!data?.getPost){
    return (<Wrapper>
        <div>Unable to find post</div>
    </Wrapper>)
  }
  return (
    <>
      <NavBar />
      <Wrapper>
        <Box m={3}>
        <Heading>{data.getPost.title}</Heading>
        
        {data?.getPost?.text}
        </Box>
        </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
