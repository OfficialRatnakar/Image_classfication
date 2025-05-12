import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const Header = ({ onSidebarOpen }) => {
  const theme = useTheme();

  return (
    <>
      <AppBar
        elevation={5}
        sx={{
          backgroundColor: '#00332f',
          color: '#00332f',
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color='inherit'
            onClick={() => onSidebarOpen()}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon fontSize='medium' />
          </IconButton>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Box sx={{ display: { md: 'inline', xs: 'none' } }}>
              <IconButton size='large' disabled>
                <CameraAltIcon
                  style={{
                    color: theme.palette.common.white,
                    height: 30,
                    width: 30,
                  }}
                />
                <Typography
                  component='h1'
                  variant='h3'
                  sx={{
                    flexGrow: 1,
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    marginLeft: '10px',
                  }}
                >
                  Image Classification
                </Typography>
              </IconButton>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component='a'
            color='primary'
            href='/'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              marginRight: 2,
              '& svg': {
                marginRight: 0.5,
              },
            }}
          >
            <HomeOutlinedIcon /> Home
          </Button>
          <Button
            component='a'
            color='primary'
            href='/classifier'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              marginRight: 2,
              '& svg': {
                marginRight: 0.5,
              },
            }}
          >
            <InsertPhotoOutlinedIcon style={{ height: 23, width: 23 }} /> Image
            Classifier
          </Button>
        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
};

export default Header;
