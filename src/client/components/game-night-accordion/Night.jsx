import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ListItem,
  Accordion,
  AccordionSummary,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import ExpandCircleDownTwoToneIcon from '@mui/icons-material/ExpandCircleDownTwoTone';
import NightDetails from './NightDetails';

const { useState } = React;
function Night({ gameNight, getGameNights }) {
  // Set state values for editing an event
  const [editingName, setEditingName] = useState(false);
  const [event, setEvent] = useState(gameNight);
  // Set state value to check if toggle is allowed

  // PATCH edited event name
  const patchName = (element) => {
    // Change the editingName value in state
    setEditingName(false);
    // Grab the new name and the event id
    const { _id } = gameNight;
    const { value } = element.target;
    // Make sure the value is not empty
    if (!value) {
      return;
    }
    // Build config to send
    const config = {
      newDocument: { name: value },
    };
    // Send an axios PATCH req
    axios.patch(`/api/game-nights/${_id}`, config)
    // Cause page rerender
      .then(getGameNights)
      .catch((err) => {
        console.error('Error patching event name: ', err);
      });
  };

  // Handle change in textField
  const handleChange = (element) => {
    // Grab the new value
    const { value } = element.target;
    // Make a copy of the evenet object from state
    const eventCopy = { ...event };
    // Change the name in gameNight to value
    eventCopy.name = value;
    // Change the state of event to the new object
    setEvent(eventCopy);
  };
  // Allow enter click to patch name
  const handleKeyClick = (element) => {
    // Destructure the key from the element
    const { key } = element;
    // Check if the key is enter
    if (key === 'Enter') {
      // Call function to PATCH name
      patchName(element);
    } else if (key === 'Escape') {
      // Reset the value of the textField
      const eventCopy = { ...event };
      eventCopy.name = gameNight.name;
      setEvent(eventCopy);
      // Leave name edit mode
      setEditingName(false);
    }
  };
  // Reset the text field name in name editor when field loses focus
  const resetNameField = () => {
    const eventCopy = { ...event };
    eventCopy.name = gameNight.name;
    setEditingName(false);
    setEvent(eventCopy);
  };
  return (
    <ListItem>
      <Accordion
        sx={{ width: 3 / 4 }}
      >
        <AccordionSummary
          expandIcon={<ExpandCircleDownTwoToneIcon />}
          justify="space-between"
        >
          {
            !editingName
              ? (
                <Typography
                  variant="h6"
                  sx={{ marginRight: 'auto', '&:hover': { color: 'white' } }}
                  onClick={() => { setEditingName(true); }}
                >
                  {gameNight.name}
                </Typography>
              ) : (
                <TextField
                  value={event.name}
                  sx={{ marginRight: 'auto' }}
                  onChange={handleChange}
                  onBlur={resetNameField}
                  onKeyUp={handleKeyClick}
                  helperText="Hit enter to save"
                  autoFocus
                />
              )
}
          <Typography
            sx={{ paddingRight: 2.5 }}
          >
            {
                gameNight.isCancelled
                  ? 'Cancelled'
                  : moment(gameNight.fullDate).calendar(
                    null,
                    {
                      sameDay: '[Today at] h:mm a',
                      nextDay: '[Tomorrow at] h:mm a',
                      nextWeek: 'dddd [at] h:mm a',
                      sameElse: 'dddd, MMMM Do',
                    },
                  )
          }
          </Typography>
        </AccordionSummary>
        <NightDetails
          gameNight={gameNight}
          getGameNights={getGameNights}
        />
      </Accordion>
    </ListItem>
  );
}

Night.propTypes = {
  gameNight: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    guests: PropTypes.arrayOf(PropTypes.string),
    fullDate: PropTypes.instanceOf(Date),
    date: PropTypes.string,
    time: PropTypes.string,
    isCancelled: PropTypes.bool,
  }).isRequired,
  getGameNights: PropTypes.func.isRequired,
};

export default Night;
