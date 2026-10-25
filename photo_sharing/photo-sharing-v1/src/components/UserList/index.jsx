import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/user/list")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error loading user list: ", error);
      })
  }, [])

  return (
    <div className="user-list-container">
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItemButton
              component={Link}
              to={`/users/${user._id}`}
            >
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={`${user.photo_count || 0} photos`}
              />
            </ListItemButton>
          </React.Fragment>
        ))}

      </List>
    </div>
  );
}



export default UserList;
