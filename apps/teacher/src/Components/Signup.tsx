import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { teacherState } from "../store/atoms/teacher";
import axios from "axios";
import { BASE_URL } from "../config";
import { teacherSignupParams } from "types";
import { Button, Card, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const Signup = () => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = useSetRecoilState(teacherState);
  const navigate = useNavigate();
  const handleOnClick = async () => {
    const signupInputs: teacherSignupParams = {
      firstname,
      lastname,
      username,
      password,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/teacher/signup`,
        JSON.stringify(signupInputs),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.firstname) {
        setUser({
          isLoading: false,
          userEmail: data.firstname,
        });
        navigate("/questions");
      }
    } catch (e) {
      setUser({
        isLoading: false,
        userEmail: null,
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Card
        variant="outlined"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2vw",
          width: "30vw",
        }}
      >
        <TextField
          label="firstname"
          value={firstname}
          fullWidth={true}
          margin={"dense"}
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
        />
        <TextField
          label="lastname"
          value={lastname}
          margin={"dense"}
          fullWidth={true}
          onChange={(e) => {
            setLastname(e.target.value);
          }}
        />
        <TextField
          label="username"
          value={username}
          margin={"dense"}
          fullWidth={true}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          label="password"
          value={password}
          type={"password"}
          margin="dense"
          fullWidth={true}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <Button variant="contained" size="large" onClick={handleOnClick}>
          Signup
        </Button>
      </Card>
    </div>
  );
};
