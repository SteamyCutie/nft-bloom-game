import { InjectedConnector } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import Web3 from 'web3';

const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

const web3 = new Web3(Web3.givenProvider)
const contractABI = require("../../data/CharacterNFT.json");

const acceptedChains = ENVIRONMENT === 'development' ? [1, 3, 4, 5, 42] : [1, 2];

export const characterNFT = new web3.eth.Contract(contractABI.abi, NFT_ADDRESS);

export const injected = new InjectedConnector({ supportedChainIds: acceptedChains, });

export const mintWhitelist = async (account, proof) => {
    console.log('minting whitelist...');
    const amount = '0.01';
    const amountToWei = web3.utils.toWei(amount, 'ether');
    const result = characterNFT.methods.mintWhitelist(proof).send({ from: account, value: amountToWei }).then((result) => {
      console.log(result);
      console.log(`✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result);
        return {
          success: true,
          status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result
          };
    }).catch((err) => {
        console.log("Mint transaction failed!");
        return {
        success: false,
        status: "😥 Something went wrong: " + err.message
        }
    }).finally((result) => {
        return result;
    });
    return result;
}

export const mintPublic = async (account, numberOfTokens) => {
    console.log('minting publicMint...');
    const amount = (numberOfTokens * 0.02).toString();
    const amountToWei = web3.utils.toWei(amount, 'ether');
    const result = characterNFT.methods.publicMint(numberOfTokens).send({ from: account, value: amountToWei }).then((result) => {
      console.log(`✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result);
        return {
          success: true,
          status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result
          };
    }).catch((err) => {
      console.log("Mint transaction failed!");
      return {
        success: false,
        status: "😥 Something went wrong: " + err.message
        }
    });
    return result;
};

export function abridgeAddress(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export default function blank() { return <></>}