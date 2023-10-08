import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { timeOuts as _timeOuts, timer as _timer } from "../store/atoms/timer";
import { timeIntervals as _timeIntervals } from "../store/atoms/timer";
import { testSummaryDialog as _testSummaryDialog } from "../store/atoms/testSummaryDialog";
import { useEffect, useState } from "react";
import { testActive as _testActive } from "../store/atoms/testActive";
import { questionCartArray as _questionCartArray } from "../store/selectors/questionCart";
import { clearIntervalsAndTimeOuts } from "../helpers/clearTimeOutsAndTimeIntervals";
import { submit as _submit } from "../store/atoms/submit";

const timeTaken = (time: { minutes: number; seconds: number }): string => {
  const plural = (n: number, s: string): string => {
    return n.toString() + " " + s + (n > 1 ? "s" : "");
  };
  if (time.minutes && time.seconds) {
    return `Time taken: ${plural(time.minutes, "minute")} and ${plural(
      time.seconds,
      "second"
    )}.`;
  } else if (time.minutes) {
    return `Time taken: ${plural(time.minutes, "minute")}.`;
  } else if (time.seconds) {
    return `Time taken: ${plural(time.seconds, "second")}.`;
  }
  return "0 second.";
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const [testSummaryDialog, setTestSummaryDialog] =
    useRecoilState(_testSummaryDialog);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const totalQuestionCount = useRecoilValue(_questionCartArray);
  const setTestActive = useSetRecoilState(_testActive);
  const handleClose = () => {
    clearIntervalsAndTimeOuts(
      timeOuts,
      setTimeOuts,
      timeIntervals,
      setTimeIntervals
    );
    setTestActive("ended");
    setTestSummaryDialog({
      show: false,
      correctAnswersCount: testSummaryDialog.correctAnswersCount,
    });
  };
  const timer = useRecoilValue(_timer);
  const [time, setTime] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });
  const testQuestion = useRecoilValue(_questionCartArray);
  const submit = useRecoilValue(_submit);
  useEffect(() => {
    const timeInSeconds = Math.min(
      timer.submitTime - timer.startTime,
      testQuestion.length * 60
    );
    console.log(timer);
    setTime({
      minutes: Math.round(timeInSeconds / 60),
      seconds: Math.round(timeInSeconds % 60),
    });
  }, [submit]);
  useEffect(() => {
    if (typeof testSummaryDialog.correctAnswersCount === "undefined") {
      console.log("error", testSummaryDialog);
    }
  }, []);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={testSummaryDialog.show}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Test Summary
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
        <DialogContent dividers>
          <Typography gutterBottom>
            {`${testSummaryDialog.correctAnswersCount} question${
              testSummaryDialog.correctAnswersCount &&
              testSummaryDialog.correctAnswersCount > 1
                ? "s were "
                : " was "
            } correct out of ${totalQuestionCount.length}.`}
          </Typography>
          <Typography gutterBottom>{timeTaken(time)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Okay
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
