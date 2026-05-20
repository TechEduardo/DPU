import * as React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import styles from './Loading.module.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#053616',
    },
  },
});

export default function Loading({ isLoading }: any) {

  if(isLoading) 
    return (
      <div className={styles.loading}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress color='primary' />
          </Box>
        </ThemeProvider>
      </div>
    );

  return null;
}