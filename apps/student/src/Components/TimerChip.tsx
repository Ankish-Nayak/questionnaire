import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import {
  timeInterval as _timeInterval,
  timeOut as _timeOut,
} from "../store/atoms/timer";
import { toAnalog } from "../helpers/toAnalog";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { answerParams } from "types";
import { timer as _timer } from "../store/atoms/timer";
import { testActive as _testActive } from "../store/atoms/testActive";
import { answers as _answers } from "../store/atoms/answers";
import { BASE_URL } from "../config";
import axios from "axios";
import { submit as _submit } from "../store/atoms/submit";
import { questionCart as _testQuestions } from "../store/atoms/questionCart";
import { selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";

export default function TimerChip({ seconds }: { seconds: number }) {
  const [timer, setTimer] = useRecoilState(_timer);
  const [time, setTime] = useState<number>(
    timer.endTime - new Date().getTime() / 1000
  );
  const [text, setText] = useState<string>(toAnalog(seconds));
  const navigate = useNavigate();
  const testQuestions = useRecoilValue(_testQuestions);
  const setTestActive = useSetRecoilState(_testActive);
  const selectedAnswers: answerParams[] = [];
  const setAnswers = useSetRecoilState(_answers);
  const [timeInterval, setTimeInterval] = useRecoilState(_timeInterval);
  const [timeOut, setTimeOut] = useRecoilState(_timeOut);
  const setSubmit = useSetRecoilState(_submit);
  const autoSubmit = async () => {
    console.log(selectedAnswers);
    setTestActive(false);
    setTimer({
      isLoading: false,
      show: false,
      startTime: timer.startTime,
      endTime: timer.endTime,
    });
    clearTimeout(timeOut);
    clearInterval(timeInterval);
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
        const generateMap = (): Promise<Map<number, string>> => {
          return new Promise((res, rej) => {
            const map = new Map<number, string>();
            results.forEach(({ questionId, answer }) => {
              console.log(questionId, answer);
              map.set(questionId, answer);
            });
            res(map);
          });
        };
        generateMap()
          .then((map) => {
            console.log(JSON.stringify(map));
            setAnswers(map);
          })
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    // adding these gives us liberty to clear timeInterval from any where
    setTimeInterval(
      setInterval(() => {
        setTime(timer.endTime - new Date().getTime() / 1000);
        console.log(time);
      }, 1000)
    );
    // adding this gives us liberty to clear timeout from any where
    setTimeOut(
      setTimeout(
        () => {
          console.log("cleared");
          clearInterval(timeInterval);
          setTimer({
            isLoading: false,
            show: false,
            startTime: timer.startTime,
            endTime: timer.endTime,
          });
          autoSubmit();
          setTestActive(false);
        },
        (timer.endTime - timer.startTime) * 1000
      )
    );
    console.log("a");
    return () => {
      console.log("cleared");
      clearInterval(timeInterval);
      clearTimeout(timeOut);
      setSubmit(false);
    };
  }, []);

  useEffect(() => {
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
