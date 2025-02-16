import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
} from '@mui/material';

function Login() {
  // Set up the navigate function to navigate user to /home if already logged in
  const navigate = useNavigate();

  // Checks if the user is already logged in
  const verifyUserLoggedIn = () => {
    axios.get('/auth/user')
      /*
        Success, sends back 'data':
          - As an empty string (not logged in) or,
          - As an object (logged in)
      */
      .then(({ data }) => {
        if (data) {
          navigate('/home');
        }
      })
      // Failure, handle errors
      .catch((err) => {
        console.error('Failed to verifyUserLoggedIn:', err);
      });
  };

  // When component mounts, check if the user is already logged in
  useEffect(verifyUserLoggedIn, []);

  return (
    <Box
      sx={{
        paddingTop: 20,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'Tourney Variable',
        }}
      >
        Welcome to
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Tourney Variable',
          fontSize: 128,
        }}
      >
        Game Knight
      </Typography>
      <Typography variant="h5">
        Start your board game journey here!
      </Typography>
      <Box
        component="section"
        sx={{
          alignContent: 'center',
          pt: 2,
        }}
      >
        <Button
          href="/auth"
          color="secondary"
        >
          Login with Google
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
