const { Router } = require('express');
const { GameNights } = require('../database');

const gameNightsRouter = Router();

// End point starts with '/api/game-nights'
// gameNightsRouter.get('/')

gameNightsRouter.get('/', (req, res) => {
  // Grab the id from the user object on req
  const { _id } = req.user;
  // Created a query filter with the id
  const queryFilter = { user: _id };
  // Retrieve the GameNights with the _id from the database
  GameNights.find(queryFilter).sort({ fullDate: -1 })
    .then((gameNights) => {
      // Send back the GameNights and correct status codes
      res.status(200).send(gameNights);
    }).catch((err) => {
      // Handle any errors
      console.error('Error GETting the GameNights from db: ', err);
      res.sendStatus(500);
    });
});

gameNightsRouter.post('/', (req, res) => {
  // Grab the id from the user object in the request
  const { _id } = req.user;
  // Grab the request body
  const { formValues } = req.body;
  // Add the id to the formValues to be added to the database
  formValues.user = _id;
  // Add the new gamenight to the database
  GameNights.create(formValues).then(() => {
    // Send back the proper status codes
    res.sendStatus(201);
  }).catch((err) => {
    console.error('Error adding game night to database: ', err);
    res.sendStatus(500);
  });
});

gameNightsRouter.delete('/:id', (req, res) => {
  // Grab the id from the req params
  const { id } = req.params;
  // Delete the event from the database
  GameNights.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error deleting the event: ', err);
      res.sendStatus(500);
    });
});

gameNightsRouter.patch('/:id', (req, res) => {
  // Grab the id from req params
  const { id } = req.params;
  // Grab the config from the req body
  const { newDocument } = req.body;
  // Query the database to update the event with the correct id
  GameNights.findByIdAndUpdate(id, newDocument)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error cancelling event in the database: ', err);
      res.sendStatus(500);
    });
});

module.exports = {
  gameNightsRouter,
};
