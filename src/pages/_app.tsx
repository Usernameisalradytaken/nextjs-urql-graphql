import Wrapper from "@/components/Wrapper";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  IsLoggedInResponse,
  LoginDocument,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "@/generated/generated";
import "@/styles/globals.css";
import { CSSReset, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache";
import type { AppProps } from "next/app";
import {
  Client,
  Provider,
  createClient,
  fetchExchange,
  mapExchange,
} from "urql";
import { devtoolsExchange } from "@urql/devtools";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fun: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fun(result, data as any) as any);
}
const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },
  exchanges: [
    devtoolsExchange,
    mapExchange({
      onError(error, operation) {
        console.log(
          "onError &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",
          error,
          operation
        );
      },
      onOperation: (operation) => {
        console.log(
          "operation--------------------==-=-=-",
          operation.query,
          operation.key,
          operation.kind,
          operation
        );
      },
      onResult: (result) => {
        console.log(
          "result--------------------==-=-=-",
          result.data,
          result.error,
          result.operation,
          result
        );
      },
    }),
    cacheExchange({
      updates: {
        Mutation: {
          Logout: (_result, args, cache, info) => {
            console.log("################", _result, args, cache, info);
            cache
              .inspectFields("Query")
              .filter((field) => field.fieldName === "isLoggedIn")
              .forEach((field, i, fieldInfo) =>
                console.log("FIFIFIFIFIFII", field, i, fieldInfo)
              );

            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return {
                  me : null
                };
              }
            );
          },
          Register: (_result, args, cache, info) => {
            console.log("################", _result, args, cache, info);

            betterUpdateQuery<RegisterMutation, IsLoggedInQuery>(
              cache,
              { query: IsLoggedInDocument },
              _result,
              (result, query) => {
                if (result.Register.error) {
                  return query;
                } else {
                  return {
                    isLoggedIn: {
                      isLogged: {
                        is: true,
                        username: result.Register.user?.username,
                        id: result.Register.user?.id,
                      },
                    },
                  };
                }
              }
            );
          },
          Login: (_result, args, cache, info) => {
            console.log(
              "##########INSIDE LOGINNNNN ######",
              _result,
              args,
              cache,
              info
            );
            // cache
            // .inspectFields("Query")
            // .filter((field) => field.fieldName === "isLoggedIn")
            // .forEach((field,i,fieldInfo) => console.log("129e-h12j-je12ej-",field,i,fieldInfo));
            // const a = cache.resolve({ __typename: "Login" }, "isLoggedIn");
            // console.log(a);

            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.Login.error && result.Login.user?.id) {
                  return query;
                } else {
                  return {
                    me: {
                      id: result.Login.user?.id,
                      username: result.Login.user?.username,
                    },
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <CSSReset />
        <Provider value={client}>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </Provider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
