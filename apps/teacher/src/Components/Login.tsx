import { useState } from "react";
import { teacherLoginParams } from "types";
import { BASE_URL } from "../config";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { teacherState } from "../store/atoms/teacher";
import { Card, TextField, Button } from "@mui/material";
export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setTeacher = useSetRecoilState(teacherState);
  const navigate = useNavigate();
  const handleOnClick = async () => {
    const loginInputs: teacherLoginParams = {
      username,
      password,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/teacher/login`,
        JSON.stringify(loginInputs),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.firstname) {
        setTeacher({
          isLoading: false,
          userEmail: data.firstname,
        });
        navigate("/questions");
      } else {
        setTeacher({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch (e) {
      setTeacher({
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
