import InputField from "@/components/InputField";
import {
  useChangePasswordByMailMutation,
  useForgetPasswordMutation,
} from "../../generated/generated";
import createUrqlClient from "@/util/urqlClient";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";
import { Heading } from "@chakra-ui/react";

const SendPasswordLink: NextPage<{ token: string }> = ({}) => {
  const [, useForgetPasswordMutationFunc] = useForgetPasswordMutation();
  const [formError, setFormError] = useState({} as any);
  const router = useRouter();
  return (
    <>
      <Heading size={"lg"}>Enter the Registered Email to get change password link</Heading>

      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values, actions) => {
          setFormError("");
          useForgetPasswordMutationFunc({
            email: values.email,
          })
            .then((result) => {
              console.log(result);
              if (!result.data?.forgetPassword) {
                setFormError({
                  status: 400,
                  message: "Please check your email",
                });
              } else {
                console.log(result.data?.forgetPassword);
                setFormError({ status : 200, message : "Mail sent" });
                // setTimeout(() => {
                    // router.push("/")
                // })
              }
              actions.setSubmitting(false);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        {(props) => (
          <Form>
            <Box mt={4}>
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                label="Email"
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Send Mail
            </Button>
            {formError.status ? (
              <Box
                p={2}
                bgColor={formError?.status == 200 ? "green.100" : "red.100"}
                mt={2}
              >
                {formError?.message}
              </Box>
            ) : (
              ""
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(SendPasswordLink);
