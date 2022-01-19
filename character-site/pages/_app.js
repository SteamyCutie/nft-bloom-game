import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import Header from "../components/core/Header";
import createEmotionCache from '../styles/createEmotionCache';
import "../styles/globals.css";
import theme from '../styles/theme';
import Footer from "../components/core/Footer";
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from "@web3-react/core";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bloom Game Character NFT</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          CssBaseline kickstart an elegant, consistent, and simple baseline to build upon.
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </Web3ReactProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}