require("dotenv").config();

const API_URL = process.env.RINKEBY_API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/CharacterNFT.sol/CharacterNFT.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const setBaseURI = async (baseURI) => {
  let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': nftContract.methods.setBaseURI(baseURI).encodeABI()
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
      console.log(`setBaseURI is complete! Set base uri to ${baseURI}`);
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    })
};

const uri = "https://gateway.pinata.cloud/ipfs/QmbsutoyESYa4YwktxtusqyzF6ThzcSdh5cufFhw7PK58D/";
setBaseURI(uri);