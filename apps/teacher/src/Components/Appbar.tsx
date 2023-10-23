import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isTeacherLoading,
  teacherEmailState,
} from "../store/selectors/teacher";
import { teacherState } from "../store/atoms/teacher";
import { Typography, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../config";
import axios from "axios";
import { api } from "../api/api";

export const Appbar = () => {
  const teacherLoading = useRecoilValue(isTeacherLoading);
  const teacherName = useRecoilValue(teacherEmailState);
  const setTeacher = useSetRecoilState(teacherState);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setTeacher({
      isLoading: false,
      userEmail: null,
    });
    navigate("/");
    try {
      const res = await api.teacherLogout();
      setTeacher({
        isLoading: false,
        userEmail: null
      });
      console.log(res)
      // const response = await axios.post(`${BASE_URL}/teacher/logout`);
      // const data = response.data;
      // console.log(data.message);
      // setTeacher({
      //   isLoading: false,
      //   userEmail: null,
      // });
    } catch (e) {
      console.log(e);
    }
  };
  if (teacherLoading) {
    return <div>Loading...</div>;
  }
  if (teacherName) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">
          <Link to={"/"} style={{ textDecoration: "none" }}>
            Teacher
          </Link>
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            navigate("/questions");
          }}
        >
          Questions
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            navigate("/questions/me");
          }}
        >
          My Questions
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            navigate("/addQuestion");
          }}
        >
          Add question
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "15%",
          }}
        >
          <Link
            to={"/profile"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Typography variant="h5" style={{}}>
              {teacherName}
            </Typography>
          </Link>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          Teacher
        </Link>
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "15%",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Signup
        </Button>
      </div>
    </div>
  );
};
