import {
  DeletePostMutation,
  DeletePostMutationVariables,
  IsLoggedInDocument,
  IsLoggedInQuery,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  Post,
  PostSnippetFragment,
  RegisterMutation,
} from "@/generated/generated";
import { devtoolsExchange } from "@urql/devtools";
import { Resolver, cacheExchange , Cache } from "@urql/exchange-graphcache";
import { fetchExchange, mapExchange, Exchange, stringifyVariables } from "urql";
import { filter, pipe, tap } from "wonka";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";
import { gql } from "@urql/core";
import { NextUrqlAppContext } from "next-urql";
import { isServer } from "./isServer";
export const cursorPagination = (): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    console.log(entityKey, fieldName);

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);

    // console.log(fieldInfos);

    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // console.log("fieldArgs", fieldArgs);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    // console.log(fieldKey);
    const inCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !inCache;
    console.log("inCache", inCache);

    let hasMore;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      // console.log(key);
      const data = cache.resolve(key, "posts");
      hasMore = cache.resolve(key, "hasMore");
      // console.log(data, hasMore);
      results.push(...(data as Array<string>));
    });

    return { __typename: "PaginatedPosts", hasMore, posts: results };
  };
};

const invalidateCache = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "getPosts"
              );

              fieldInfos.map((fi) => {
                cache.invalidate("Query", "getPosts", fi.arguments);
              });
}


const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // console.log(error);

        if (
          typeof window !== "undefined" &&
          error?.message.includes("Not Authenticated")
        ) {
          // console.log(error.message);

          Router.replace("/login?next=" + Router.pathname);
        }
      })
    );
  };

const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  // console.log(ctx);

  if (isServer() && ctx) {
    // console.log("ctx", ctx.req.headers.cookie);
    cookie = ctx.req?.headers.cookie;
    // console.log(ctx.ctx.req?.headers.cookie);
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },

    exchanges: [
      devtoolsExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            getPosts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              console.log("___________START____________");

              cache.invalidate(`Post:${args.id}`);
              console.log("_________________END_______________");
            },
            vote: (_result, args, cache, info) => {
              console.log(_result, args, cache, info);
              console.log("___________START____________");

              const data: any = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: args.postId }
              );
              console.log("--------vote", data);
              if (data) {
                if (data.voteStatus === args.value) {
                  return;
                }
                const newPoints =
                  data.points +
                  (!data.voteStatus ? 1 : 2) * (args.value as number);
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      id
                      points
                      voteStatus
                    }
                  `,
                  {
                    id: args.postId,
                    points: newPoints,
                    voteStatus: args.value,
                  } as any
                );
              }
              console.log(
                cache.readFragment(
                  gql`
                    fragment _ on Post {
                      id
                      points
                    }
                  `,
                  { id: args.postId }
                )
              );
              console.log("_________________END_______________");
            },
            createPost: (_result, args, cache, info) => {
              // console.log("start");
              // console.log(cache.inspectFields("Query"));

              invalidateCache(cache)

              // console.log(cache.inspectFields("Query"));
              // console.log("end");
            },
            Logout: (_result, args, cache, info) => {
              // console.log("################", _result, args, cache, info);

              invalidateCache(cache);

              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => {
                  return {
                    me: null,
                  };
                }
              );
            },
            Register: (_result, args, cache, info) => {
              // console.log("################", _result, args, cache, info);

              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.Register.error) {
                    return query;
                  } else {
                    return {
                      me: {
                        id: result.Register.user?.id!,
                        username: result.Register.user?.username!,
                      },
                    };
                  }
                }
              );
            },
            Login: (_result, args, cache, info) => {
              // console.log(
              //   "##########INSIDE LOGINNNNN ######",
              //   _result,
              //   args,
              //   cache,
              //   info
              // );
              invalidateCache(cache);

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
                        __typename: "User",
                        id: result.Login.user?.id!,
                        username: result.Login.user?.username!,
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
      errorExchange,
      fetchExchange,
    ],
  };
};

export default createUrqlClient;
