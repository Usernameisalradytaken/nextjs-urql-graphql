import InputField from "@/components/InputField";
import NavBar from "@/components/NavBar";
import Wrapper from "@/components/Wrapper";
import {
  useGetPostQuery,
  useMeQuery,
  useUpdatePostMutation,
} from "@/generated/generated";
import createUrqlClient from "@/util/urqlClient";
import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";

const EditPost = () => {
  const router = useRouter();
  const postID =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [formError, setFormError] = useState({} as any);
  const [{ data, fetching }] = useGetPostQuery({
    pause: postID == -1,
    variables: {
      id: postID,
    },
  });
  const [{}, updatePost] = useUpdatePostMutation();

  const [{ data: currentUser, fetching: currentUserFetching }] = useMeQuery();



  if (fetching) {
    return (
      <Wrapper>
        <NavBar />
        <h1>Loading...</h1>
      </Wrapper>
    );
  }

  if (!data?.getPost) {
    return (
      <Wrapper>
        <NavBar />
        <Heading textAlign={"center"} color={"red.500"} mt={5}>
          There is no Post {postID}
        </Heading>
      </Wrapper>
    );
  }


  if (!currentUserFetching && currentUser?.me?.id !== data?.getPost?.creatorId) {
    return (
      <Wrapper>
        <NavBar />
        <Heading textAlign={"center"} color={"red.500"} mt={5}>
          Not Authorized to edit post {postID}
        </Heading>
      </Wrapper>
    );
  }

  return (
    <>
      <NavBar />

      <Wrapper>
        <Formik
          initialValues={{ title: data.getPost.title, text: data.getPost.text }}
          onSubmit={async (values, actions) => {
            setFormError("");
            if (values.text.length > 3 && values.title.length > 3) {
              const { error, data } = await updatePost({
                id: postID,
                text: values.text,
                title: values.title,
              });
              if (error?.message.includes("Not Authenicated")) {
                console.log(error.message);
                setFormError({
                  status: 400,
                  message: "Not Authenticated: Redirecting to Login",
                });
              }
              if (data) {
                console.log(data);
                setFormError("");
                router.back()
              }
            } else {
              setFormError({ status: 400, message: "Add more characters > 3" });
            }
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Box mt={4}>
                <InputField
                  type="text"
                  name="title"
                  placeholder="title"
                  label="Title"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  type="text"
                  name="text"
                  placeholder="Text"
                  textArea={true}
                  label="Text"
                />
              </Box>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Update Post
              </Button>
              {formError.status ? (
                <Box
                  p={2}
                  bgColor={
                    formError?.status == 200
                      ? "green.100"
                      : formError?.status == 300
                      ? "yellow.100"
                      : "red.100"
                  }
                  mt={2}
                >
                  {formError?.message}
                </Box>
              ) : null}
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
