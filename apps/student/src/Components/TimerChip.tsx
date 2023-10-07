import Chip from "@mui/material/Chip";
import { useState, useEffect, useRef } from "react";
import {
  timeIntervals as _timeIntervals,
  timeOuts as _timeOuts,
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
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import { clearTimeouts } from "../helpers/clearTimeouts";
import { clearIntervals } from "../helpers/clearIntervals";
import { testSummaryDialog as _testSummaryDialog } from "../store/atoms/testSummaryDialog";
import { calculateCorrectAnswerCount } from "../helpers/calculateCorrectAnswerCount";
export default function TimerChip({ seconds }: { seconds: number }) {
  const [timer, setTimer] = useRecoilState(_timer);
  const [time, setTime] = useState<number>(
    timer.endTime - new Date().getTime() / 1000
  );
  const [text, setText] = useState<string>(toAnalog(seconds));
  const navigate = useNavigate();
  const testQuestions = useRecoilValue(_testQuestions);
  const setTestActive = useSetRecoilState(_testActive);
  // const selectedAnswers: answerParams[] = [];
  const setAnswers = useSetRecoilState(_answers);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const useRefTimeOuts = useRef<NodeJS.Timer[]>([]);
  const useRefTimeIntervals = useRef<NodeJS.Timeout[]>([]);
  const setTestSummaryDialog = useSetRecoilState(_testSummaryDialog);
  const setSubmit = useSetRecoilState(_submit);
  const selectedOptionsStorageKeys = useRecoilValue(
    _selectedOptionsStorageKeys
  );
  const getStoredSelectedOptions = () => {
    return new Promise<answerParams[]>((res) => {
      const promises = selectedOptionsStorageKeys.map((key) => {
        return new Promise<answerParams>((res1) => {
          const value: answerParams = JSON.parse(
            localStorage.getItem(key) || ""
          );
          res1(value);
        });
      });
      Promise.all(promises).then((results) => {
        res(results);
      });
    });
  };
  const autoSubmit = (
    selectedAnswers: answerParams[]
  ): Promise<Map<number, string>> => {
    return new Promise<Map<number, string>>(async (res, rej) => {
      console.log("autosubmit");
      setTestActive(false);
      setTimer({
        isLoading: false,
        show: false,
        startTime: timer.startTime,
        endTime: timer.endTime,
        submitTime: new Date().getTime() / 1000,
      });
      Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
      Promise.all(clearIntervals(timeIntervals)).then((msgs) =>
        console.log(msgs)
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
          const generateMap = (
            map: Map<number, string>
          ): Promise<Map<number, string>> => {
            return new Promise<Map<number, string>>((res, rej) => {
              const promises = results.map(({ questionId, answer }) => {
                return new Promise<void>((res1) => {
                  map.set(questionId, answer);
                  res1();
                });
              });
              Promise.all(promises).then(() => {
                setAnswers(() => {
                  return map;
                });
                res(map);
              });
            });
          };
          generateMap(new Map<number, string>()).then((map) => {
            calculateCorrectAnswerCount(map, selectedAnswers)
              .then((result) => {
                setTestSummaryDialog({
                  show: true,
                  correctAnswersCount: result,
                });
              })
              .catch((e) => {
                console.log(e);
              });
            console.log("genrate Map: ", map);
            res(map);
          });
        }
      } catch (e) {
        console.log(e);
        rej(e);
      }
    });
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
          getStoredSelectedOptions().then((selectedAnswers) => {
            console.log(selectedAnswers);
            autoSubmit(selectedAnswers)
              .then((res) => console.log("Generate map", res))
              .catch((e) => console.log(e));
            setTestActive(false);
          });
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
