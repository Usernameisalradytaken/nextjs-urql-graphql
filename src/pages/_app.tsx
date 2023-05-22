import Wrapper from "@/components/Wrapper";
import "@/styles/globals.css";
import createUrqlClient from "@/util/urqlClient";
import { CSSReset, ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <CSSReset />
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default  App ;
