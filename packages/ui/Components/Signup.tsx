import axios from "axios";
import { useState } from "react";
import { studentSignupParams } from "types";
import { useSetRecoilState, RecoilState } from "recoil";
import { Card, Button, TextField } from "@mui/material";
import { api } from "../api/api";
import {
  assertParamExists,
  setApiKeyToObject,
} from "../../node-client/openapi/common";

export const Signup = ({
  user,
  // href,
  userState,
}: {
  // href: string;
  user: "student" | "teacher";
  userState: RecoilState<{
    isLoading: boolean;
    userEmail: string | null;
  }>;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const setUser = useSetRecoilState(userState);

  const handleOnClick = async () => {
    const parsedInputs: studentSignupParams = {
      username,
      password,
      firstname,
      lastname,
    };

    try {
      if (user === "student") {
        const res = await api.studentSignup(parsedInputs);
        setUser({
          isLoading: false,
          userEmail: res.data.firstname,
        });
      } else {
        const res = await api.teacherSignup(parsedInputs);
        setUser({
          isLoading: false,
          userEmail: res.data.firstname,
        });
      }
      // const vresponse = await axios.post(href, JSON.stringify(parsedInputs), {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = response.data;
      // if (data.firstname) {
      //   serUser({
      //     isLoading: false,
      //     userEmail: data.firstname,
      //   });
      // } else {
      //   serUser({
      //     isLoading: false,
      //     userEmail: null,
      //   });
      // }
    } catch (e) {
      console.log(e);
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
