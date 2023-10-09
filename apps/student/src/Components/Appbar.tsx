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
import {
  timer as _timer,
  timeIntervals as _timeIntervals,
  timeOuts as _timeOuts,
} from "../store/atoms/timer";
import { submit as _submit } from "../store/atoms/submit";
import { testActive as _testActive } from "../store/atoms/testActive";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import axios from "axios";
import { BASE_URL } from "../config";
import { clearIntervals } from "../helpers/clearIntervals";
import { clearTimeouts } from "../helpers/clearTimeouts";
import { useResetItems } from "../store/hooks/hooks";
export const Appbar = () => {
  const studentLoading = useRecoilValue(isStudentLoading);
  const studentName = useRecoilValue(studentEmailState);
  const setStudent = useSetRecoilState(studentState);
  const testQuestions = useRecoilValue(questionCartArray);
  const navigate = useNavigate();
  const [timer, setTimer] = useRecoilState(_timer);
  const setSubmit = useSetRecoilState(_submit);
  const [testActive, setTestActive] = useRecoilState(_testActive);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const handleLogout = async () => {
    setStudent({
      isLoading: false,
      userEmail: null,
    });
    navigate("/");
    try {
      const response = await axios.post(`${BASE_URL}/student/logout`);
      const data = response.data;
      console.log(data.message);
    } catch (e) {
      console.log(e);
      setStudent({
        isLoading: false,
        userEmail: null,
      });
    }
  };
  const updateSelectedOptions = useResetItems();
  const handleStartTestDialog = async () => {
    const response = await updateSelectedOptions(testQuestions);
    console.log(response);
    Promise.all(clearIntervals(timeIntervals)).then((msgs) =>
      console.log(msgs)
    );
    Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
    setTimeIntervals([]);
    setTimeOuts([]);
    setSubmit(false);
    setTestActive("running");
    setTimer({
      isLoading: false,
      show: true,
      startTime: new Date().getTime() / 1000,
      endTime: new Date().getTime() / 1000 + testQuestions.length * 60,
      submitTime: 0,
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
        {testActive !== "running" && (
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              navigate("/testQuestions/view");
            }}
          >
            Test Questions {(testQuestions && testQuestions.length) || ""}
          </Button>
        )}
        {testActive !== "running" && (
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              navigate("/questions/view");
            }}
          >
            Questions
          </Button>
        )}
        {testActive !== "running" &&
          testQuestions &&
          testQuestions.length > 0 &&
          !timer.show && (
            <StartTestDialog
              buttonVariant="outlined"
              buttonSize="large"
              handleOnClick={handleStartTestDialog}
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
          <Link
            to={"/profile"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Typography variant="h5" style={{}}>
              {studentName}
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
