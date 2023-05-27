import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useMeQuery,
  useVoteMutation,
} from "@/generated/generated";
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
import {
  ArrowUpIcon,
  ArrowDownIcon,
  AddIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useRouter } from "next/router";

function Index() {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as string | null,
  });
  const router = useRouter();
  const [{ data: currentUserData }] = useMeQuery();
  const [{ operation }, vote] = useVoteMutation();
  const [{ data, fetching }] = useGetPostsQuery({
    variables,
  });
  const [, DeleteFunc] = useDeletePostMutation();
  console.log(data);

  if (!data && !fetching) {
    return <div>There is problem while getting the posts</div>;
  }

  if (!data && fetching) {
    return <div>Loading...</div>;
  }

  

  console.log(
    currentUserData && currentUserData.me?.id && 1 !== currentUserData.me?.id
      ? "auto"
      : "none"
  );

  return (
    <>
      <Wrapper>
        <NavBar />
        <Flex p={5} align={"center"}>
          {/* <Heading>Lite Reddit</Heading> */}
          <Link style={{ marginLeft: "auto" }} href={"/createPost"}>
            <Button>+ New Post</Button>
          </Link>
        </Flex>
        <Box m={3}>
          <Stack spacing={4}>
            {data!.getPosts.posts.map((post) =>
              !post ? null : (
                <Box p={5} key={post.id} shadow="md" borderWidth="1px">
                  <Flex align={"flex-start"} mt={3}>
                    <Box mr={"auto"}>
                      <Link href={`/post/[id]`} as={`/post/${post.id}`}>
                        {/* <ChakraLink> */}
                        <Heading fontSize="xl">{post.title}</Heading>
                        {/* </ChakraLink> */}
                        <Text>Posted by {post.creator.username}</Text>
                        <Text mt={4}>{post.textSnippet}</Text>
                      </Link>
                    </Box>
                    <IconButton
                      aria-label="Delete post"
                      pointerEvents={
                        currentUserData &&
                        post.creator.id === currentUserData.me?.id
                          ? "auto"
                          : "none"
                      }
                      onClick={() => {
                        if (
                          currentUserData &&
                          currentUserData.me?.id &&
                          post.creator.id !== currentUserData.me?.id
                        ) {
                          return;
                        }

                        router.push(`/post/edit/${post.id}`);
                      }}
                      icon={<EditIcon />}
                    />
                  </Flex>
                  <Flex align={"center"} mt={3}>
                    <IconButton
                      colorScheme={post.voteStatus === 1 ? "orange" : ""}
                      pointerEvents={post.voteStatus === 1 ? "none" : "auto"}
                      onClick={async () => {
                        if (post.voteStatus === 1) {
                          return;
                        }
                        await vote({
                          postId: post.id,
                          value: 1,
                        });
                      }}
                      variant={"ghost"}
                      // colorScheme='blue'
                      aria-label="Down vote"
                      mr={2}
                      icon={<ArrowUpIcon />}
                    />
                    {post.points}
                    <IconButton
                      variant={"ghost"}
                      pointerEvents={post.voteStatus === -1 ? "none" : "auto"}
                      colorScheme={post.voteStatus == -1 ? "orange" : ""}
                      onClick={async () => {
                        if (post.voteStatus === -1) {
                          return;
                        }
                        await vote({
                          postId: post.id,
                          value: -1,
                        });
                      }}
                      // colorScheme='blue'
                      aria-label="Down vote"
                      ml={2}
                      icon={<ArrowDownIcon />}
                    />
                    <IconButton
                      aria-label="Delete post"
                      colorScheme="red"
                      ml={"auto"}
                      pointerEvents={
                        currentUserData &&
                        post.creator.id === currentUserData.me?.id
                          ? "auto"
                          : "none"
                      }
                      onClick={() => {
                        if (
                          currentUserData &&
                          currentUserData.me?.id &&
                          post.creator.id !== currentUserData.me?.id
                        ) {
                          return;
                        }

                        DeleteFunc({
                          id: post.id,
                        });
                      }}
                      icon={<DeleteIcon />}
                    />
                  </Flex>
                </Box>
              )
            )}
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
