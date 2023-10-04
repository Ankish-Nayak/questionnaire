import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { timer as _timer } from "../store/atoms/timer";
import {
  timeInterval as _timeInterval,
  timeOut as _timeOut,
} from "../store/atoms/timer";
import { toAnalog } from "../helpers/toAnalog";

export default function TimerChip({ seconds }: { seconds: number }) {
  const [time, setTime] = useState<number>(seconds);
  const [timer, setTimer] = useRecoilState(_timer);
  const [text, setText] = useState<string>(toAnalog(seconds));
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(timer.endTime - new Date().getTime() / 1000);
      console.log(time);
    }, 1000);
    const timeOut = setTimeout(
      () => {
        console.log("cleared");
        clearInterval(timeInterval);
        setTimer({
          isLoading: false,
          show: false,
          startTime: timer.startTime,
          endTime: timer.endTime,
        });
      },
      (timer.endTime - timer.startTime) * 1000
    );
    console.log("a");
    return () => {
      console.log("cleared");
      clearInterval(timeInterval);
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    setText(toAnalog(time));
  }, [time]);
  return (
    <Chip
      label={text}
      variant="outlined"
      sx={{
        fontWeight: "600",
        fontSize: "25px",
        color: "blue",
      }}
    />
  );
}
