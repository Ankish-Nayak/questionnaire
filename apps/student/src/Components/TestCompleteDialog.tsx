import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { answerParams } from "types";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  timer as _timer,
  timeIntervals as _timeIntervals,
  timeOuts as _timeOuts,
} from "../store/atoms/timer";
import { answers as _answers } from "../store/atoms/answers";
import { submit as _submit } from "../store/atoms/submit";
import { testActive as _testActive } from "../store/atoms/testActive";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import { clearTimeouts } from "../helpers/clearTimeouts";
import { clearIntervals } from "../helpers/clearIntervals";
import { testSummaryDialog as _testSummaryDialog } from "../store/atoms/testSummaryDialog";
import { calculateCorrectAnswerCount } from "../helpers/calculateCorrectAnswerCount";
import { testCompleteDialog as _testCompleteDialog } from "../store/atoms/testCompleteDialog";
import { useEffect } from "react";
import { clearIntervalsAndTimeOuts } from "../helpers/clearTimeOutsAndTimeIntervals";
import { useLoadItems, useUpdateItems } from "../store/hooks/hooks";
import { questionCartArray } from "../store/selectors/questionCart";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// make backend request to get right answers for selected questions
// and calculate correct answers too.
// and then call TestSummaryComponent

export const TestCompleteDialog = () => {
  const setSubmit = useSetRecoilState(_submit);
  const [timer, setTimer] = useRecoilState(_timer);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const setTestActive = useSetRecoilState(_testActive);
  const setTestStestSummaryDialog = useSetRecoilState(_testSummaryDialog);
  const [testCompleteDialog, setTestCompleteDiolog] =
    useRecoilState(_testCompleteDialog);
  const useUpdateAnwers = useUpdateItems();
  const useLoadSelectedOptions = useLoadItems();
  const testQuestions = useRecoilValue(questionCartArray);
  const handleSubmit = async () => {
    const selectedAnswers: answerParams[] = (await useLoadSelectedOptions(
      testQuestions
    )) as answerParams[];
    console.log(selectedAnswers);
    setTimer({
      isLoading: false,
      show: false,
      startTime: timer.startTime,
      endTime: timer.endTime,
      submitTime: new Date().getTime() / 1000,
    });
    clearIntervalsAndTimeOuts(
      timeOuts,
      setTimeOuts,
      timeIntervals,
      setTimeIntervals
    );
    // make request to backend
    try {
      const response = await axios.post(
        `${BASE_URL}/student/attempt`,
        JSON.stringify(selectedAnswers),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.answers) {
        console.log("answers");
        console.log(data.answers);
        setSubmit(true);
        const results: answerParams[] = data.answers;
        console.log("results", results);
        const generateMap = (
          map: Map<number, string>
        ): Promise<Map<number, string>> => {
          return new Promise<Map<number, string>>((res) => {
            const promises = results.map(({ questionId, answer }) => {
              return new Promise<void>((res1) => {
                console.log(questionId, answer);
                map.set(questionId, answer);
                res1();
              });
            });
            Promise.all(promises).then(async () => {
              console.log("promise", map);
              const response = await useUpdateAnwers(map, res);
              console.log(response);
            });
          });
        };
        generateMap(new Map<number, string>()).then((map) => {
          calculateCorrectAnswerCount(map, selectedAnswers)
            .then((result) => {
              // below line will leads to rerendering too there component will also rerender
              // hence we can take adavantage of this to show answers in its child compoent
              setTestStestSummaryDialog({
                show: true,
                correctAnswersCount: result,
              });
            })
            .catch((e) => {
              console.log(e);
            });
          console.log("generateMap", map);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("cleared from useEffect");
    clearIntervalsAndTimeOuts(
      timeOuts,
      setTimeOuts,
      timeIntervals,
      setTimeIntervals
    );
    Promise.all(clearIntervals(timeIntervals)).then((msgs) => {
      console.log(msgs);
    });
    Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
  }, [testCompleteDialog]);
  const handleClose = () => {
    // make request to backend
    setTestCompleteDiolog(false);
    handleSubmit();
    setTestActive("ended");
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={testCompleteDialog}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Test Completed
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Okay
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};
