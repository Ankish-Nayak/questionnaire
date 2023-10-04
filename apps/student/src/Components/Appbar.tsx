import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Typography, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import {
  isStudentLoading,
  studentEmailState,
} from "../store/selectors/student";
import { studentState } from "../store/atoms/student";
import { questionCartArray } from "../store/selectors/questionCart";
import { StartTestDialog } from "./StartTestDialog";
import TimerChip from "./TimerChip";
import { timer as _timer } from "../store/atoms/timer";
export const Appbar = () => {
  const studentLoading = useRecoilValue(isStudentLoading);
  const studentName = useRecoilValue(studentEmailState);
  const setStudent = useSetRecoilState(studentState);
  const testQuestions = useRecoilValue(questionCartArray);
  const navigate = useNavigate();
  const [timer, setTimer] = useRecoilState(_timer);
  const handleOnClick = () => {
    setTimer({
      isLoading: false,
      show: true,
      startTime: new Date().getTime() / 1000,
      endTime: new Date().getTime() / 1000 + testQuestions.length * 60,
    });
  };
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
            navigate("/testQuestions/view");
          }}
        >
          Test Questions {(testQuestions && testQuestions.length) || ""}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            navigate("/questions/view");
          }}
        >
          Questions
        </Button>
        {testQuestions && testQuestions.length > 0 && !timer.show && (
          <StartTestDialog
            buttonVariant="outlined"
            buttonSize="large"
            handleOnClick={handleOnClick}
          />
        )}
        {timer.show && <TimerChip seconds={testQuestions.length * 60} />}
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
            {studentName}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setStudent({
                isLoading: false,
                userEmail: null,
              });
              navigate("/");
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
