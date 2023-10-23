import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { profileParams } from "types";
import { useSetRecoilState, RecoilState } from "recoil";
import { api } from "../api/api";
export const EditProfile = ({
  user,
  // href,
  userState,
}: {
  user: "student" | "teacher";
  // href: string;
  userState: RecoilState<{
    isLoading: boolean;
    userEmail: string | null;
  }>;
}) => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [result, setResult] = useState<"success" | "error">("error");
  const setUser = useSetRecoilState(userState);
  const handleClose = () => {
    setOpen(false);
  };
  const handleReset = () => {
    init();
  };
  const handleUpdate = async () => {
    const parsedInputs: profileParams = {
      firstname,
      lastname,
      username,
    };
    try {
      if (user === "student") {
        const res = await api.studentUpdateProfile(parsedInputs);
        setOpen(true);
        setResult("success");
        setUser({
          isLoading: false,
          userEmail: res.data.firstname,
        });
      } else {
        const res = await api.teacherUpdateProfile(parsedInputs);
        setOpen(true);
        setResult("success");
        setUser({
          isLoading: false,
          userEmail: res.data.firstname,
        });
      }
      // const response = await axios.put(href, JSON.stringify(parsedInputs), {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = response.data;
      // if (data.firstname) {
      //   setOpen(true);
      //   setResult("success");
      //   setUser({
      //     isLoading: false,
      //     userEmail: firstname,
      //   });
      // }
    } catch (e: any) {
      if (
        e.response &&
        e.response.data &&
        e.response.data.message === "username taken"
      ) {
        setOpen(true);
        setResult("error");
      }
      console.log(e);
    }
  };
  const init = async () => {
    try {
      const res = await api.studentGetProfile();
      setFirstname(res.data.firstname);
      setLastname(res.data.lastname);
      setUsername(res.data.username);
      // const response = await axios.get(href);
      // const data = response.data;
      // if (data.firstname) {
      //   setFirstname(data.firstname);
      //   setLastname(data.lastname);
      //   setUsername(data.username);
      // }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {result === "success" ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            "Profile updated"
          </Alert>
        ) : (
          <Alert severity="error">"Username already taken"</Alert>
        )}
      </Snackbar>
      <Card
        variant={"outlined"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "max-content",
          margin: "auto",
        }}
      >
        <CardContent>
          <TextField
            label={"firstname"}
            value={firstname}
            fullWidth={true}
            variant={"outlined"}
            onChange={(e) => setFirstname(e.target.value)}
            margin="normal"
          />
          <TextField
            label={"lastname"}
            value={lastname}
            fullWidth={true}
            onChange={(e) => setLastname(e.target.value)}
            variant={"outlined"}
            margin="normal"
          />
          <TextField
            label={"username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth={true}
            variant={"outlined"}
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button onClick={handleReset} variant={"outlined"}>
            Reset
          </Button>
          <Button onClick={handleUpdate} variant={"outlined"}>
            Update
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
