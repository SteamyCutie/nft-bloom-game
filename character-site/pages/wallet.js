import { Container, Stack } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { characterNFT } from "./utils/_web3";
import axios from 'axios';

const Wallet = () => {
  const { active, account } = useWeb3React();
  const contract_address = process.env.NEXT_PUBLIC_NFT_ADDRESS;
  const [displayTokens, setDisplayTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    if (!active || !account) {
      return;
    }
    async function checkNFTBalance() {
        characterNFT.methods.balanceOf(account).call().then((result) => {
            const resultFloat = parseFloat(result, 10);
            setTokenBalance(resultFloat);
        }).catch((err) => {
            console.error('err', err);
            setTokenBalance(0);
        });
    }
    checkNFTBalance();
  }, [account]);

  useEffect(() => {
    if (!active || !account) {
        return;
    }
    async function getContractInfo() {
        const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ?
        `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${contract_address}` :
        `https://api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${contract_address}`;

        try {
            const response = await axios.get(url);
            setDisplayTokens(Array(response.data.assets));
            console.log('result', Array(response.data.assets));
        } catch (err) {
            console.error(err);
        }
    }
    getContractInfo()
  }, [account]);

  return (
    <Container sx={{py: 5, minHeight: '80vh'}}>
      <Stack spacing={2}>
      <h1>Your Wallet</h1>
      {!active && <p>
        Your wallet must be connected to view this page.
        </p>}
      {active && <div>
        {tokenBalance <= 0 && <p>You have no minted NFTs yet.</p>}
        {tokenBalance > 0 && <p>View your {tokenBalance} minted NFTs here:</p>}
        {tokenBalance > 0 && displayTokens && displayTokens[0] && displayTokens[0].length > 0
          && displayTokens[0].map((token, i) => {
          return <Stack
                  key={i}
                  paddingTop={4}
                  paddingBottom={4}
                  width={'100%'}
                  justifyContent="center"
                  alignItems="center"
                >

                  {token?.image_url ?
                    <img alt="nft" src={token.image_url} /> :
                    <p>Image not available yet</p> }
                  <p>Name: {token?.name}</p>
                  <p>Token id: {token?.id}</p>
                  <p>Metadata <a href={token?.token_metadata} target="_blank" rel="noreferrer">link</a></p>
                </Stack>
              })}
        {tokenBalance > 0 && displayTokens && displayTokens[0] && displayTokens[0].length === 0 && <p>Calling Opensea API. It may take a few minutes to retrieve your NFTs.</p>}
      </div>}
      </Stack>
    </Container>
  )
};

export default Wallet;