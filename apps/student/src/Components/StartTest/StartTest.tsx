import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { questionCartArray } from "../../store/selectors/questionCart";
import { Stack, Button } from "@mui/material";
import { answerParams } from "types";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import {
  timer as _timer,
  timeIntervals as _timeIntervals,
  timeOuts as _timeOuts,
} from "../../store/atoms/timer";
import { answers as _answers } from "../../store/atoms/answers";
import { submit as _submit } from "../../store/atoms/submit";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { clearTimeouts } from "../../helpers/clearTimeouts";
import { clearIntervals } from "../../helpers/clearIntervals";
import CustomizedDialogs from "../TestCompleteDialog";
import { testCompleteDialog as _testCompleteDialog } from "../../store/atoms/testCompleteDialog";
import { TestQuestion } from "./TestQuestion";
// import { saveState } from "../hooks/usePersistedStorage";
export const StartTest = () => {
  const testQuestions = useRecoilValue(questionCartArray);
  const [submit, setSubmit] = useRecoilState(_submit);
  const [timer, setTimer] = useRecoilState(_timer);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const [selectedOptionsStorageKeys, setSelectedOptionsStorageKeys] =
    useRecoilState(_selectedOptionsStorageKeys);
  const [answers, setAnswers] = useRecoilState(_answers);
  const handleShowAnswers = async () => {
    Promise.all(clearIntervals(timeOuts)).then((msgs) => console.log(msgs));
    Promise.all(clearTimeouts(timeIntervals)).then((msgs) => console.log(msgs));
    setTimeOuts([]);
    setTimeIntervals([]);
    console.log(answers);
  };
  const setTestActive = useSetRecoilState(_testActive);
  const setTestCompleteDialog = useSetRecoilState(_testCompleteDialog);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const handleSubmit = async () => {
    const selectedAnswers: answerParams[] = [];
    selectedOptionsStorageKeys.forEach((key) => {
      const value: answerParams = JSON.parse(localStorage.getItem(key) || "");
      selectedAnswers.push(value);
    });
    console.log(selectedAnswers);
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
        // below line will leads to rerendering too there component will also rerender
        // hence we can take adavantage of this to show answers in its child compoent
        setTestCompleteDialog(true);
        const calculateCorrectAnswerCount = () => {
          let res = 0;
          selectedAnswers.forEach(({ questionId, answer }) => {
            res += answers?.get(questionId) === answer ? 1 : 0;
          });
          return res;
        };
        setCorrectAnswersCount(calculateCorrectAnswerCount());
        // CustomizedDialogs({value:true});
        console.log("answers");
        console.log(data.answers);
        setSubmit(true);
        const results: answerParams[] = data.answers;
        console.log("results", results);
        const generateMap = (
          map: Map<number, string>
        ): Promise<Map<number, string>> => {
          return new Promise((res, rej) => {
            // const map = new Map<number, string>();
            const promises = results.map(({ questionId, answer }) => {
              return new Promise<void>((res1) => {
                console.log(questionId, answer);
                map.set(questionId, answer);
                res1();
              });
            });
            Promise.all(promises).then(() => {
              console.log("promise", map);
              setAnswers(() => {
                console.log("set answers", map);
                return map;
              });
              // setRender(new Date().getTime());
              res(map);
            });
          });
        };
        // const answerMap = new Map<number, string>();
        generateMap(new Map<number, string>());
        // .then((map) => {
        //   console.log(JSON.stringify(map));
        //   // setAnswers(() => {
        //   //   return map;
        //   // });
        //   console.log("answers map", JSON.stringify(map));
        // })
        // .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Stack
      direction={"column"}
      spacing={2}
      sx={{
        padding: "10vh 20vw",
      }}
    >
      {testQuestions &&
        testQuestions.map((questionId, idx) => {
          return (
            <TestQuestion
              key={idx}
              questionId={questionId}
              submit={submit}
            />
          );
        })}
      <Button
        variant="contained"
        size="medium"
        onClick={submit ? handleShowAnswers : handleSubmit}
        sx={{
          alignSelf: "center",
        }}
      >
        {submit ? "show answers" : "submit"}
      </Button>
      <CustomizedDialogs
        correctAnswersCount={correctAnswersCount}
        totalQuestionCount={testQuestions.length}
      />
    </Stack>
  );
};
