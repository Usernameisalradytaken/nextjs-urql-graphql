import { useMeQuery } from "@/generated/generated";
import { useRouter } from "next/router";
import { Dispatch, useEffect, useState } from "react";

export const useIsAuth = (formError?: Dispatch<any>) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();
  // console.log("FROM THE CUSTOM HOOOOOOOKKKKKK",data,fetching);
  
  useEffect(() => {
    // console.log("data", data);
    // console.log("fetching", fetching);

    if ( !fetching && !data?.me?.id) {
      if (formError)
        formError({ status: 300, message: "Redirecting to Login..." });
      setTimeout(() => {
      router.replace("/login");
      }, 1500);
    }
  }, [fetching,data]);
};
