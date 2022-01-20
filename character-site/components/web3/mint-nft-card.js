import { Button, Card, CardActions, CardContent, Tooltip, Input, Typography, Zoom } from '@mui/material';
import Image from 'next/image';

const MintNFTCard = ({title, description, action, canMint, showNumToMint, setNumToMint, mintStatus}) => {
  const handleChange = (event) => {
    const numToMint = parseInt(event.target.value);
    setNumToMint(numToMint);
  };

  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{title}</Typography>
        <Image alt="Character NFT" src={(title === 'Whitelist Mint' ? '/whitelist-nft.png' : '/public-nft.png')} width={250} height={250}/>
        {mintStatus ? <p>Success! Check your wallet in a few minutes.</p> : <p>{description}</p>}
      </CardContent>
      <CardActions>
        {showNumToMint &&
          <Input onChange={handleChange} defaultValue={2} type="number" label="number to mint"
            sx={{mx: 3}}
          />}
        <Tooltip  TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} disabled={!canMint} title={canMint ? "Minting is now available" : "Minting is not currently available with due to some problems!"} arrow>
          <span>
            <Button disabled={!canMint} sx={{ m : 1 }} onClick={action} variant="contained">Mint</Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default MintNFTCard;