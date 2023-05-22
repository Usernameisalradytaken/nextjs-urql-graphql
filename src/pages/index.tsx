import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import { useGetPostsQuery, useVoteMutation } from "@/generated/generated";
import createUrqlClient from "@/util/urqlClient";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

function Index() {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as string | null,
  });
  const [{operation}, vote] = useVoteMutation()
  const [{ data, fetching }] = useGetPostsQuery({
    variables,
  });

  console.log(operation);
  
  if (!data && !fetching) {
    return <div>There is problem while getting the posts</div>;
  }

  if (!data && fetching) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Wrapper>
        <NavBar />
        <Flex p={5} align={"center"}>
          <Heading>Lite Reddit</Heading>
          <Link style={{ marginLeft: "auto" }} href={"/createPost"}>
            <Box>Add Post</Box>
          </Link>
        </Flex>
        <Box m={3}>
          <Stack spacing={4}>
            {data?.getPosts.posts.map((post) => (
              <Box p={5} key={post.id} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text>Posted by {post.creator.username}</Text>
                <Text mt={4}>{post.textSnippet}</Text>
                <Flex align={"center"} mt={3}>
                  <IconButton
                  onClick={async () =>{
                  await vote({
                    postId : post.id,
                    value  : 1
                  })
                  }}
                    variant={"unstyled"}
                    // colorScheme='blue'
                    aria-label="Down vote"
                    mr={2}
                    icon={<ArrowUpIcon />}
                  />
                  {post.points}

                  <IconButton
                    variant={"unstyled"}
                    onClick={async() =>{
                      await vote({
                        postId : post.id,
                        value  : -1
                      })
                      }}
                    // colorScheme='blue'
                    aria-label="Down vote"
                    ml={2}
                    icon={<ArrowDownIcon />}
                  />
                </Flex>
              </Box>
            ))}
            {data && data.getPosts.hasMore ? (
              <Flex>
                <Button
                  isLoading={fetching}
                  onClick={() => {
                    setVariables({
                      limit: variables.limit,
                      cursor:
                        data.getPosts.posts[data.getPosts.posts.length - 1]
                          .createdAt,
                    });
                  }}
                  m={"auto"}
                  my={8}
                >
                  Load More
                </Button>
              </Flex>
            ) : null}
          </Stack>
        </Box>
      </Wrapper>
    </>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
