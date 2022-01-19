const main = async () => {
  const CharacterNFT = await hre.ethers.getContractFactory("CharacterNFT")
  const characterNFT = await CharacterNFT.deploy();
  console.log("Contract deployed to address:", characterNFT.address);
  await characterNFT.deployed();
  console.log("Contract successfully deployed!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();