import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Grid2, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import GroupForm from "../components/GroupForm";
import Group from "../components/Group";

const Grid = Grid2;

function Groups() {
  // This'll be a page where groups are created and named,
  // as well as a page where a user's created groups can be seen
  // perhaps also the groups the user currently belongs to?(backlog)
  // this page only exists to fill out forms and show existing groups,
  // set groups to state.
  const [groups, setGroups] = useState([]);
  /**
   * Page Needs
   * 1. List of groups(Perhaps accordian'd)
   * 1a. Set up a useEffect that gets all our groups each time we add or delete one
   * 1b. Add an editing option to change info on a group
   * 1c. A separate delete option that only deletes players, not the entire group
   * 2. group maker form
   * 2a. Create the form on a separate component.
   */
  function getGroups() {
    axios
      .get("/api/groups")
      .then(({ data }) => {
        console.log(data);
        setGroups(data);
      })
      .catch((err) => {
        console.error("Could not Get groups", err);
      });
  }

  useEffect(getGroups, []);
  /**
   * Rendering Navbar, then the Form component, followed by a grid
   * structure of groups that user owns on cards
   */
  console.log('Groups:', groups)
  return (
    <div>
      <Navbar />
      <GroupForm getGroups={getGroups} />
      {groups.map((group) => {
        const { _id, name, players, games } = group;
        return (
          <Group
            id={_id}
            group={group}
            key={_id}
            name={name}
            players={players}
            games={games}
            getGroups={getGroups}
          />
        );
      })}
    </div>
  );
}

export default Groups;
