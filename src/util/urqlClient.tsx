import {  fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache'; 


const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions : {
    credentials : "include" as RequestCredentials 
  },
  exchanges: [cacheExchange, ssrExchange, fetchExchange],
});

export default createUrqlClient;