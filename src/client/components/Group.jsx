import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Grid2 } from "@mui/material";
import axios from 'axios';

function Group({ id, name, players, games, getGroups }) {
  function deleteGroup() {
    // run axios delete with the _id from the key prop
    axios
      .delete(`/api/groups/${id}`)
      .then(() => {
        getGroups();
      })
      .catch((err) => {
        console.error("Unable to Delete group", err);
      });
    }
    return (
      <Card
        elevation={10}
        style={{ height: "120px", width: "120px", padding: "14px" }}
      >
        <div>{name}</div>
        <div>{players}</div>
        <div>{games}</div>
        <button type="button" onClick={deleteGroup}>
          DELETE
        </button>
      </Card>
    );
}
Group.propTypes = {
  name: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  games: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  getGroups: PropTypes.func.isRequired,
};
export default Group;
