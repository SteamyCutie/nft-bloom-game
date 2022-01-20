import { Grid, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { mintPublic, mintWhitelist, characterNFT } from '../../pages/utils/_web3';
import MintNFTCard from './mint-nft-card';
import Web3 from 'web3';

const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;

const MintNFT = () => {
  const web3 = new Web3(Web3.givenProvider)

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { active, account, chainId } = useWeb3React();

  const [whitelistClaimable, setWhitelistClaimable] = useState(NOT_CLAIMABLE);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const [whitelistMintStatus, setWhitelistMintStatus] = useState();
  const [publicMintStatus, setPublicMintStatus] = useState();

  const [numToMint, setNumToMint] = useState(2);

  useEffect(() => {
    if (!active || !account) {
      setAlreadyClaimed(false);
      return;
    }
    async function checkIfClaimed() {
      characterNFT.methods.isClaimed(account).call({ from: account }).then((result) => {
        setAlreadyClaimed(result);
      }).catch((err) => {
        setAlreadyClaimed(false);
      });
    }
    checkIfClaimed();
  }, [account])

  const { MerkleTree } = require('merkletreejs');
  const keccak256 = require('keccak256');
  let whitelist = require('../../data/whitelist.json');
  const hashedAddresses = whitelist.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });

  const hashedAddress = keccak256(account);
  const proof = merkleTree.getHexProof(hashedAddress);
  const root = merkleTree.getHexRoot();

  const valid = merkleTree.verify(proof, hashedAddress, root);
  const whitelistProof = proof;
  
  const showNotify = (success, status) => {
    let param = {
      width: '500px',
      timeout: 3000,
      pauseOnHover: true,
      cssAnimation: true,
      cssAnimationDuration: 500,
      cssAnimationStyle: 'fade',
    };
    if (success) Notiflix.Notify.success(status, param);
    else Notiflix.Notify.failure(status, param);
  }

  const onMintWhitelist = async () => {
    const { success, status } = await mintWhitelist(account, whitelistProof);
    showNotify(success, status);
    setWhitelistMintStatus(success);
  };  

  const onPublicMint = async () => {
    const { success, status } = await mintPublic(account, numToMint);
    showNotify(success, status);
    setPublicMintStatus(success);
  };

  return (
    <>
      <Stack id="demo">
        <h2>Mint an NFT</h2>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item>
            <MintNFTCard
              title={'Whitelist Mint'}
              description={'Mint this sample NFT to the connected wallet. Must be on whitelist. Cost: 0.01 ETH'}
              canMint={!alreadyClaimed & valid}
              mintStatus={whitelistMintStatus}
              action={onMintWhitelist}
            />
          </Grid>
          <Grid item>
            <MintNFTCard
              title={'Public Mint'}
              description={'Mint this sample NFT to the connected wallet. Open for any wallet to mint. Cost: 0.02 ETH'}
              canMint={active}
              mintStatus={publicMintStatus}
              showNumToMint={true}
              setNumToMint={setNumToMint}
              action={onPublicMint}
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default MintNFT;