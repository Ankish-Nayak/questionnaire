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

export const Profile = ({ href }: { href: string }) => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate("/profile/edit");
  };
  const init = async () => {
    try {
      const response = await axios.get(href);
      const data = response.data;
      if (data.firstname) {
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setUsername(data.username);
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
