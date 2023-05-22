import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fun: (r: Result, q: Query) => Query) {
  return cache.updateQuery(qi, (data) => fun(result, data as any) as any);
}
