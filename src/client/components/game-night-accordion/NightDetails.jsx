import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  AccordionDetails,
  Box,
  Button,
  List,
  ListItem,
  Divider,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DateEdit from './DateEdit';
import EventItem from './EventItem';

const { useState } = React;

function NightDetails({ gameNight, getGameNights }) {
  // Set sate value for opening and closing deleting/cancelling dialog
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  // Set state values to track if date and time are being edited
  const [editingDate, setEditingDate] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  // Hold value of the winner input field
  const [winner, setWinner] = useState('');
  // Functions to open and close delete dialog box
  const handleDeleteOpen = () => {
    // Change the state value to true
    setDeleting(true);
  };
  const handleDeleteClose = () => {
    // Change the state value to false
    setDeleting(false);
  };
  // Functions to open and close cancel dialog box
  const handleCancelOpen = () => {
    // Set cancelling state value to true
    setCancelling(true);
  };
  const handleCancelClose = () => {
    // Set cancelling state value to false
    setCancelling(false);
  };
  // Helper function to create a list from props arrays
  const createList = (label, prop) => (
    <Stack>
      <List>
        <Typography variant="body">{`${label}:`}</Typography>
        {prop.map((value, index) => (
          <EventItem
            key={`${value}-${index * 2}`}
            gameNight={gameNight}
            value={value}
            index={index}
            collection={prop}
            // eslint-disable-next-line no-underscore-dangle
            collectionName={label.toLowerCase()}
            getGameNights={getGameNights}
          />
        ))}
      </List>
    </Stack>
  );

  // Handle deletion of a gameNight from the database
  const handleNightDelete = () => {
    // Grab the id from the night
    const { _id } = gameNight;
    // Alert the user to make sure they want to delete the event

    // Make axios DELETE req to api/game-nights/:id
    axios.delete(`/api/game-nights/${_id}`)
    // Make call to server to get update GameNights
      .then(getGameNights)
      .catch((err) => {
        console.error('Error deleting event: ', err);
      });
  };

  // Handle click to cancel an event
  const handleCancelClick = () => {
    // Grab the _id and isCancelled fields from the gameNight prop
    const { _id, isCancelled } = gameNight;
    // Build config to send in request
    const config = { newDocument: { isCancelled: !isCancelled } };
    // Make an axios patch request to cancel the gameNight
    axios.patch(`/api/game-nights/${_id}`, config)
      .then(getGameNights)
      .then(() => { setCancelling(false); })
      .catch((err) => {
        console.error('Error canceling the event: ', err);
      });
  };
  // Handle change in winner input field
  const handleWinnerChange = (element) => {
    // Grab the value from the element
    const { value } = element.target;
    // Set the winner in state
    setWinner(value);
  };
  // PATCH the winner in the database
  const patchWinner = () => {
    // Grab the id from gameNight
    const { _id } = gameNight;
    // Build confgi object to send
    const config = {
      newDocument: {
        winner,
      },
    };
    // Make axios PATCH request
    axios.patch(`/api/game-nights/${_id}`, config)
      .then(getGameNights)
      .catch((err) => {
        console.error('Error PATCHing the winner: ', err);
      });
  };
  // Allow enter to send request
  const handleEnterClick = (element) => {
    const { key } = element;
    if (key === 'Enter') {
      patchWinner();
    }
  };
  return (
    <AccordionDetails>
      <Grid container spacing={2}>
        <Grid size={4}>
          {createList('Guests', gameNight.guests)}
        </Grid>
        <Grid size={4}>
          {createList('Games', gameNight.games)}
        </Grid>
        <Grid size={4}>
          {createList('Snacks', gameNight.snacks)}
        </Grid>
        <Grid size={12}>
          <Box>
            <Stack direction="row" spacing={1}>
              <Typography
                variant="body1"
                onClick={() => { setEditingDate(true); }}
                sx={{ '&:hover': { color: 'white' } }}
              >
                Date:
              </Typography>
              { editingDate
                ? (
                  <DateEdit
                    gameNight={gameNight}
                    getGameNights={getGameNights}
                    editingDate={editingDate}
                    editingTime={editingTime}
                    setEditingDate={setEditingDate}
                    setEditingTime={setEditingTime}
                    placeHolder="MM/DD/YY"
                    blurEvent={() => { setEditingDate(false); }}
                  />
                )
                : <Typography variant="body1">{`${moment(gameNight.fullDate).format('MMM Do')}`}</Typography>}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography
                variant="body1"
                onClick={() => { setEditingTime(true); }}
                sx={{ '&:hover': { color: 'white' } }}
              >
                Time:
              </Typography>
              { editingTime
                ? (
                  <DateEdit
                    gameNight={gameNight}
                    getGameNights={getGameNights}
                    editingDate={editingDate}
                    editingTime={editingTime}
                    setEditingDate={setEditingDate}
                    setEditingTime={setEditingTime}
                    placeHolder="23:59"
                    blurEvent={() => { setEditingTime(false); }}
                  />
                )
                : <Typography>{`${moment(gameNight.fullDate).format('h:mm a')}`}</Typography>}
            </Stack>
          </Box>
        </Grid>
        {moment(gameNight.fullDate).isAfter(moment())
        && !gameNight.isCancelled
        && (
          <Button
            variant="contained"
            size="small"
            sx={{ marginRight: 'auto' }}
            onClick={handleCancelOpen}
          >
            Cancel Event
          </Button>
        )}
        {moment(gameNight.fullDate).isAfter(moment())
        && gameNight.isCancelled
        && (
          <Button
            variant="contained"
            size="small"
            sx={{ marginRight: 'auto' }}
            onClick={handleCancelClick}
          >
            Uncancel
          </Button>
        )}
        {moment(gameNight.fullDate).isBefore(moment())
        && !gameNight.isCancelled
        && (
        <Typography
          variant="subtitle2"
          sx={{ marginRight: 'auto' }}
        >
          Winner:
          {gameNight.winner ? ` ${gameNight.winner}` : (
            <TextField
              helperText="Enter to save"
              value={winner}
              onChange={handleWinnerChange}
              onKeyUp={handleEnterClick}
              sx={{
                width: 115,
                '& .MuiInputBase-root': {
                  height: 30,
                },
              }}
            />
          )}
        </Typography>
        )}
        {moment(gameNight.fullDate).isBefore(moment())
        && gameNight.isCancelled
        && <Typography variant="subtitle2" sx={{ marginRight: 'auto' }} />}
        <Button
          variant="contained"
          size="small"
          onClick={handleDeleteOpen}
        >
          Delete
        </Button>
      </Grid>
      <Dialog open={deleting} onClose={handleDeleteClose}>
        <DialogTitle>
          Delete Your Event
          {` ${gameNight.name}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleNightDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={cancelling} onClose={handleCancelClose}>
        <DialogTitle>
          Cancel Event
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your event
            {` ${gameNight.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>No</Button>
          <Button onClick={handleCancelClick}>Yes</Button>
        </DialogActions>
      </Dialog>
    </AccordionDetails>
  );
}

NightDetails.propTypes = {
  gameNight: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    guests: PropTypes.arrayOf(PropTypes.string),
    snacks: PropTypes.arrayOf(PropTypes.string),
    games: PropTypes.arrayOf(PropTypes.string),
    fullDate: PropTypes.instanceOf(Date),
    date: PropTypes.string,
    time: PropTypes.string,
    isCancelled: PropTypes.bool,
    winner: PropTypes.string,
  }).isRequired,
  getGameNights: PropTypes.func.isRequired,
};

export default NightDetails;
