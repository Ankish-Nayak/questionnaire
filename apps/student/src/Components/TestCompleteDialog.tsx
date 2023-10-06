import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useRecoilState, useRecoilValue } from "recoil";
import { timeOuts as _timeOuts, timer as _timer } from "../store/atoms/timer";
import { timeIntervals as _timeIntervals } from "../store/atoms/timer";
import { clearIntervals } from "../helpers/clearIntervals";
import { clearTimeouts } from "../helpers/clearTimeouts";
import { testCompleteDialog as _testCompleteDialog } from "../store/atoms/testCompleteDialog";
import { useEffect, useState } from "react";
import { testActive as _testActive } from "../store/atoms/testActive";

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

export default function CustomizedDialogs({
  correctAnswersCount,
  totalQuestionCount,
}: {
  correctAnswersCount: number;
  totalQuestionCount: number;
}) {
  const [open, setOpen] = useRecoilState(_testCompleteDialog);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const handleClose = () => {
    Promise.all(clearIntervals(timeIntervals)).then((msgs) =>
      console.log(msgs)
    );
    Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
    setTimeIntervals([]);
    setTimeOuts([]);
    setOpen(false);
  };
  const timer = useRecoilValue(_timer);
  const [time, setTime] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });
  const testActive = useRecoilValue(_testActive);
  useEffect(() => {
    setTime({
      minutes: Math.round((timer.submitTime - timer.startTime) / 60),
      seconds: Math.round((timer.submitTime - timer.startTime) % 60),
    });
  }, [testActive]);

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
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
            {`${correctAnswersCount} question${
              correctAnswersCount > 1 ? "s were " : " was "
            } correct out of ${totalQuestionCount}.`}
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
