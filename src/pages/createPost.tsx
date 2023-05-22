import InputField from "@/components/InputField";
import Wrapper from "@/components/Wrapper";
import { useCreatePostMutation, useMeQuery } from "@/generated/generated";
import { useIsAuth } from "@/util/customHooks";
import createUrqlClient from "@/util/urqlClient";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CreatePost: React.FC<{}> = () => {
  const [formError, setFormError] = useState({} as any);
  const router = useRouter();
  //   const [{ data, fetching }] = useMeQuery();

  useIsAuth(setFormError);

  //   useEffect(() => {
  //     if (!data?.me) {
  //       setFormError({ status: 300, message: "Redirecting to Login..." });
  //       setTimeout(() => {
  //         router.replace("/login");
  //       }, 1500);
  //     }
  //   }, [fetching, data, router, setFormError]);

  const [, createPost] = useCreatePostMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, actions) => {
          setFormError("");
          if (values.text.length > 3 && values.title.length > 3) {
            const { error, data } = await createPost({
              input: {
                text: values.text,
                title: values.title,
              },
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
              router.push("/");
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
              Create Post
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
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
