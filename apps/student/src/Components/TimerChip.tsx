import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { timer } from "../store/atoms/timer";

export default function TimerChip({ seconds }: { seconds: number }) {
  const [time, setTime] = useState<number>(seconds);
  const displayText = (t: number) => {
    let minutes: number = Math.floor(t / 60);
    let seconds: number = Math.floor(t % 60);
    const leadingZero = (s: string) => {
      return s.length == 1 ? "0" + s : s;
    };
    return (
      leadingZero(minutes.toString()) + ":" + leadingZero(seconds.toString())
    );
  };
  const [text, setText] = useState<string>(displayText(seconds));
  const setTimer = useSetRecoilState(timer);
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime((time) => time - 1);
      console.log(time);
    }, 1000);
    const timeOut = setTimeout(() => {
      console.log("cleared");
      clearInterval(timeInterval);
      setTimer({
        isLoading: false,
        show: false,
      });
    }, seconds * 1000);
    console.log("a");
    return () => {
      console.log("cleared");
      clearInterval(timeInterval);
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    setText(displayText(time));
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
