import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Container, Stack, Button } from '@mui/material';
import MintNFT from '../components/web3/mint-nft';

export default function Home() {
  return (
    <Container>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="">Bloom Game CharacterNFT</a> with Merkle Whitelist Web3
        </h1>

        <div className={styles.description}>
          <Stack spacing={1}>
            <span>
              Get started by clicking on <Button variant="contained">Mint</Button> button below 👇
            </span>
          </Stack>
        </div>
        
        <MintNFT />
      </main>
    </Container>
  )
};
