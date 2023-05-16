


//  DONT READ THIS FILE I AM WORKING ON THIS
//  MAIN URQL CLIENT IS IN _app.tsx


import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
} from "@/generated/generated";
import { fetchExchange } from "@urql/core";
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fun: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fun(result, data as any) as any);
}

const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },

  exchanges: [
    cacheExchange({
      // keys: {
      //   isLoggedType: () => Math.random().toString(),
      //   isLoggedInResponse: () => Math.random().toString(),
      // },
      updates: {
        Mutation: {
          Logout: (_result, args, cache, info) => {
            console.log("################",_result,args, cache, info);

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
                      },
                    },
                  };
                }
              }
            );
          },
          Login: (_result, args, cache, info) => {
            console.log("################",_result,args, cache, info);
            betterUpdateQuery<LoginMutation, IsLoggedInQuery>(
              cache,
              { query: IsLoggedInDocument },
              _result,
              (result, query) => {
              
                
                if (result.Login.error) {
                  return query;
                } else {
                  return {
                    isLoggedIn: {
                      isLogged: {
                        is: true,
                        username: result.Login.user?.username,
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
    ssrExchange,
    fetchExchange,
  ],
});

export default createUrqlClient;
