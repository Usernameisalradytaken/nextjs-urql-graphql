import { useLoginMutation } from "@/generated/generated";
import InputField from "../components/InputField";

import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { useRouter } from "next/router";
import createUrqlClient from "@/util/urqlClient";
import { withUrqlClient } from "next-urql";

interface loginProps {}

const Login: React.FC = (props) => {
  const [registerResult, loginFunc] = useLoginMutation();
  const [formError, setFormError] = useState({} as any);
  const router = useRouter();
  return (
    <Formik
      initialValues={{ password: "", email: "" }}
      onSubmit={(values, actions) => {
        setFormError("");
        loginFunc({
          input: {
            email: values.email,
            password: values.password,
          },
        })
          .then((result) => {
            console.log(result);
            if (result.data?.Login.error) {
              setFormError(result.data?.Login.error);
            } else if (result.data?.Login.user) {
              // console.log(result.data?.Login.user);
              setFormError("");
              router.push("/")
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
              placeholder="email"
              label="Email"
            />
          </Box>
          <Box mt={4}>
            <InputField
              type="password"
              name="password"
              placeholder="password"
              label="Password"
            />
          </Box>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Login
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
  );
};

export default Login;
