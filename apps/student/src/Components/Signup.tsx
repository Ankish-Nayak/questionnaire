import axios from "axios";
import { useState } from "react";
import { studentSignupParams } from "types";
import { BASE_URL } from "../config";
import { useSetRecoilState } from "recoil";
import { studentState } from "../store/atoms/student";
import { Card, Button, TextField } from "@mui/material";

export const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const setStudent = useSetRecoilState(studentState);

  const handleOnClick = async () => {
    const parsedInputs: studentSignupParams = {
      username,
      password,
      firstname,
      lastname,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/student/signup`,
        JSON.stringify(parsedInputs),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.firstname) {
        setStudent({
          isLoading: false,
          userEmail: data.firstname,
        });
      } else {
        setStudent({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch (e) {
      console.log(e);
      setStudent({
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
