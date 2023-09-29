import { useRecoilValue, useSetRecoilState } from "recoil";
import { Typography, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import {
  isStudentLoading,
  studentEmailState,
} from "../store/selectors/student";
import { studentState } from "../store/atoms/student";
export const Appbar = () => {
  const studentLoading = useRecoilValue(isStudentLoading);
  const studentName = useRecoilValue(studentEmailState);
  const setStudent = useSetRecoilState(studentState);
  const navigate = useNavigate();
  if (studentLoading) {
    return <div>Loading...</div>;
  }
  if (studentName) {
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
            Student
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "15%",
          }}
        >
          <Typography variant="h5" style={{}}>
            {"ankish"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setStudent({
                isLoading: false,
                userEmail: null,
              });
              console.log("logout");
            }}
          >
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
          Student
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
