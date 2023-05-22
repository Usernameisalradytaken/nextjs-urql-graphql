import InputField from "@/components/InputField";
import { useChangePasswordByMailMutation } from "../../generated/generated";
import createUrqlClient from "@/util/urqlClient";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";

const ChangePassword: NextPage<{ token: string }> = () => {
  const [, changePasswordByMailMutationFunc] =
    useChangePasswordByMailMutation();
  const [formError, setFormError] = useState({} as any);
  const router = useRouter();

  return (
    <Formik
      initialValues={{ newPassword: "" }}
      onSubmit={(values, actions) => {
        setFormError("");

        changePasswordByMailMutationFunc({
          newPassword: values.newPassword,
          token:
            typeof router.query.token === "string" ? router.query.token : "",
        })
          .then((result) => {
            console.log(result);
            if (result.data?.changePasswordByMail.error) {
              setFormError(result.data?.changePasswordByMail.error);
              actions.setSubmitting(false);
            } else if (result.data?.changePasswordByMail.user) {
              console.log(result.data?.changePasswordByMail.user);
              setFormError("");
              setTimeout(() => {
                router.push("/");
                actions.setSubmitting(false);
              }, 1000);
              // router.push("/")
            }
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
              type="password"
              name="newPassword"
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
            Change Password
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

export default withUrqlClient(createUrqlClient)(ChangePassword);
