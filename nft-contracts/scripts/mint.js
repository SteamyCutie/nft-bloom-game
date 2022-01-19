require("dotenv").config();

const API_URL = process.env.RINKEBY_API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/CharacterNFT.sol/CharacterNFT.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const mintNFT = async (nonce, numberToMint) => {
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gasPrice': 900000000, // edit the gas price
    'gas': 200000, // set the gas
    'data': nftContract.methods.publicMint(numberToMint).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");
          } else {
            console.log("Something went wrong when submitting your transaction:", err);
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    })
};

const mintNFTs = (mints) => {
  let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
  for(let i = 0; i < mints; i ++) {
    mintNFT(nonce, 1);
    nonce += 1;
  }
  console.log(`Minting is complete! Minted ${mints} tokens`);
}

mintNFTs(5);