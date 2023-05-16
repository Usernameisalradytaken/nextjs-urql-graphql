import Wrapper from "@/components/Wrapper";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
} from "@/generated/generated";
import "@/styles/globals.css";
import { CSSReset, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache";
import type { AppProps } from "next/app";
import { Client, Provider, createClient, fetchExchange } from "urql";
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
    cacheExchange({
      // keys: {
        // isLoggedType: () => Math.random().toString(),
        // isLoggedInResponse: () => Math.random().toString(),
      // },
      updates: {
        Mutation: {
          Logout: (_result, args, cache, info) => {
            console.log("--------------" + cache);

            betterUpdateQuery<LogoutMutation, IsLoggedInQuery>(
              cache,
              { query: IsLoggedInDocument },
              _result,
              () => {
                return {
                  isLoggedIn: {
                    isLogged: null,
                  },
                };
              }
            );
          },
          Register: (_result, args, cache, info) => {
            console.log("--------------" + cache);

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
            console.log("################", cache);
            betterUpdateQuery<LoginMutation, IsLoggedInQuery>(
              cache,
              { query: IsLoggedInDocument },
              _result,
              (result, query) => {
                console.log("################", cache);
                // console.log("################", result, query);

                if (result.Login.error) {
                  return {
                    isLoggedIn: {
                      isLogged: null,
                    },
                  };
                } else {
                  return {
                    isLoggedIn: {
                      isLogged: {
                        is: true,
                        username: result.Login.user?.username,
                        id: result.Login.user?.id,
                      },
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
