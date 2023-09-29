import axios from "axios";
import { useState } from "react";
import { studentLoginParams } from "types";
import { BASE_URL } from "../config";
import { useSetRecoilState } from "recoil";
import { studentState } from "../store/atoms/student";
import { Card, Button, TextField } from "@mui/material";
export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setStudent = useSetRecoilState(studentState);
  const handleOnClick = async () => {
    const parsedInputs: studentLoginParams = {
      username,
      password,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/student/login`,
        JSON.stringify(parsedInputs),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.token) {
        setStudent({
          isLoading: false,
          userEmail: username,
        });
      } else {
        setStudent({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch (e) {
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
          width: "25vw",
        }}
      >
        <TextField
          label="username"
          margin="dense"
          value={username}
          fullWidth={true}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          label="password"
          value={password}
          margin="dense"
          type={"password"}
          fullWidth={true}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <Button variant="contained" size="large" onClick={handleOnClick}>
          Login
        </Button>
      </Card>
    </div>
  );
};
