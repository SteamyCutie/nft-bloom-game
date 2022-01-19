import Box from "@mui/material/Box";
import styles from '../../styles/Home.module.css';
import Typography from '@mui/material/Typography';
import MuiNextLink from '../../components/core/MuiNextLink';
import { GitHub } from "@mui/icons-material";
import { Stack } from "@mui/material";

const Footer = () => {
  return (
  <Box component="footer" alignItems="center" className={styles.footer} sx={{ py: 5, px: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
      >
        <MuiNextLink
          sx={{ textDecoration: "none", color: 'black' }}
          href="https://github.com/kritical0613"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub fontSize="large" />
        </MuiNextLink>
        <Typography >
            <a href="https://github.com/kritical0613" target="_blank" rel="noreferrer">kritical0613  © {new Date().getFullYear()}</a>
        </Typography>
      </Stack>
  </Box>);
};

export default Footer;