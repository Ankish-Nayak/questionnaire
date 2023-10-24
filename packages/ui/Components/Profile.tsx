import axios from "axios";
import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export const Profile = ({ user }: { user: "student" | "teacher" }) => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/profile/edit");
  };
  const init = async () => {
    try {
      if (user === "student") {
        const response = await api.studentGetProfile();
        const { firstname, lastname, username } = response.data;
        setFirstname(firstname);
        setLastname(lastname);
        setUsername(username);
      } else {
        // user ==> teacher
        const response = await api.teacherGetProfile();
        const { firstname, lastname, username } = response.data;
        setFirstname(firstname);
        setLastname(lastname);
        setUsername(username);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <Card
      variant={"outlined"}
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "max-content",
        margin: "auto",
        marginTop: "10vh",
      }}
    >
      <CardContent>
        <Typography variant={"h5"}>Firstname: {firstname}</Typography>
        <Typography variant={"h5"}>Lastname: {lastname}</Typography>
        <Typography variant={"h5"}>Username: {username}</Typography>
      </CardContent>
      <CardActions>
        <Button variant={"outlined"} onClick={handleOnClick} size={"medium"}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
