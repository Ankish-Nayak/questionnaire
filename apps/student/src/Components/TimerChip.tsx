import Chip from "@mui/material/Chip";
import { useState, useEffect, useRef } from "react";
import {
  timeIntervals as _timeIntervals,
  timeOuts as _timeOuts,
} from "../store/atoms/timer";
import { toAnalog } from "../helpers/toAnalog";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { timer as _timer } from "../store/atoms/timer";
import { testActive as _testActive } from "../store/atoms/testActive";
import { answers as _answers } from "../store/atoms/answers";
import { submit as _submit } from "../store/atoms/submit";
import { questionCart as _testQuestions } from "../store/atoms/questionCart";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import { clearTimeouts } from "../helpers/clearTimeouts";
import { clearIntervals } from "../helpers/clearIntervals";
import { testSummaryDialog as _testSummaryDialog } from "../store/atoms/testSummaryDialog";
import { testCompleteDialog as _testCompleteDialog } from "../store/atoms/testCompleteDialog";
export default function TimerChip({ seconds }: { seconds: number }) {
  const [timer, setTimer] = useRecoilState(_timer);
  const [time, setTime] = useState<number>(
    timer.endTime - new Date().getTime() / 1000
  );
  const [text, setText] = useState<string>(toAnalog(seconds));
  const navigate = useNavigate();
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const useRefTimeOuts = useRef<NodeJS.Timer[]>([]);
  const useRefTimeIntervals = useRef<NodeJS.Timeout[]>([]);
  const setSubmit = useSetRecoilState(_submit);
  const setTestCompleteDialog = useSetRecoilState(_testCompleteDialog);
  const autoSubmit = () => {
    setTestCompleteDialog(true);
  };
  useEffect(() => {
    // adding these gives us liberty to clear timeIntervals from any where
    useRefTimeIntervals.current.push(
      setInterval(() => {
        setTime(timer.endTime - new Date().getTime() / 1000);
        console.log(time);
      }, 1000)
    );
    // adding this gives us liberty to clear timeout from any where
    useRefTimeOuts.current.push(
      setTimeout(
        () => {
          console.log("cleared");
          Promise.all(clearIntervals(timeIntervals)).then((msgs) =>
            console.log(msgs)
          );
          setTimer({
            isLoading: false,
            show: false,
            startTime: timer.startTime,
            endTime: timer.endTime,
            submitTime: new Date().getTime() / 1000,
          });
          autoSubmit();
        },
        (timer.endTime - timer.startTime) * 1000
      )
    );

    console.log("a");
    return () => {
      // console.log("cleared");
      Promise.all(clearIntervals(timeIntervals)).then((msgs) =>
        console.log(msgs)
      );
      Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
      setSubmit(false);
    };
  }, []);

  useEffect(() => {
    // console.log(time);
    setTimeIntervals(() => {
      return [...useRefTimeIntervals.current];
    });
    setTimeOuts(() => {
      return [...useRefTimeOuts.current];
    });
    setText(toAnalog(time));
  }, [time]);
  return (
    <div style={{ alignSelf: "center" }}>
      <Chip
        onClick={() => {
          navigate("/startTest");
        }}
        label={text}
        variant="outlined"
        sx={{
          fontWeight: "600",
          fontSize: "25px",
          color: "blue",
        }}
      />
    </div>
  );
}
