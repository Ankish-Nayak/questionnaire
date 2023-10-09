import { useState } from "react";
import { teacherLoginParams } from "types";
import { useSetRecoilState, RecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, TextField, Button } from "@mui/material";
export const Login = ({
  href,
  userState,
  navigateTo,
  _testActive,
}: {
  href: string;
  userState: RecoilState<{
    isLoading: boolean;
    userEmail: string | null;
  }>;
  navigateTo?: string;
  _testActive?: RecoilState<"undefined" | "starts" | "running" | "ended">;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  let testActive: undefined | "undefined" | "starts" | "running" | "ended";
  if (_testActive) {
    console.log("dfdf");
    testActive = useRecoilValue(_testActive);
  }
  const handleOnClick = async () => {
    const loginInputs: teacherLoginParams = {
      username,
      password,
    };
    try {
      const response = await axios.post(href, JSON.stringify(loginInputs), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.firstname) {
        setUser({
          isLoading: false,
          userEmail: data.firstname,
        });
        if (testActive) {
          console.log("d");
          navigate(testActive === "running" ? "/startTest" : "/questions/view");
        } else {
          navigate("/questions");
        }
      } else {
        setUser({
          isLoading: false,
          userEmail: null,
        });
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
