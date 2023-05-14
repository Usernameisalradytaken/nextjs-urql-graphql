import { useRegisterMutation } from "@/generated/generated";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { Box, Button, FormErrorMessage } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { Router, useRouter } from "next/router";

interface registerProps {}

// const registerMutation = `mutation Register($username : String!, $password: String!, $email: String!){
//     Register(input: {email : $email, username: $username, password:$password}){
//       error{
//         status
//         message
//       }
//       user{
//         id
//         email
//         username
//       }
//     }
//   }`;

const register: React.FC = (props) => {
  const [registerResult, register] = useRegisterMutation();
  const [formError, setFormError] = useState({} as any);
  const router = useRouter()
  return (
    
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={(values, actions) => {
          setFormError("");
          register({
            username: values.username,
            email: values.email,
            password: values.password,
          })
            .then((result) => {
              if (result.data?.Register.error) {
                setFormError(result.data?.Register.error);
              } else if (result.data?.Register.user) {
                setFormError("");
                router.push("/")
              }
              actions.setSubmitting(false);
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        {(props) => (
          <Form>
            <InputField
              type="text"
              name="username"
              placeholder="name"
              label="Name"
            />
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
              Register
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

export default register;
