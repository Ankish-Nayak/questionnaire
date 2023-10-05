import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
} from "@mui/material";
import { pink, green } from "@mui/material/colors";
import { answerParams, questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  timer as _timer,
  timeInterval as _timeInterval,
  timeOut as _timeOut,
} from "../store/atoms/timer";
import { answers as _answers } from "../store/atoms/answers";
import { submit as _submit } from "../store/atoms/submit";
import {
  testActive as _testActive,
} from "../store/atoms/testActive";
import {
  selectedOptionsStorageKeys as _selectedOptionsStorageKeys,
} from "../store/atoms/selectedOptions";
export const StartTest = () => {
  const testQuestions = useRecoilValue(questionCartArray);
  const [submit, setSubmit] = useRecoilState(_submit);
  const [timer, setTimer] = useRecoilState(_timer);
  const timeOut = useRecoilValue(_timeOut);
  const timeInterval = useRecoilValue(_timeInterval);
  const [selectedOptionsStorageKeys, setSelectedOptionsStorageKeys] =
    useRecoilState(_selectedOptionsStorageKeys);
  const [answers, setAnswers] = useRecoilState(_answers);
  const handleShowAnswers = async () => {};
  const setTestActive = useSetRecoilState(_testActive);
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
            <TestQuestion key={idx} questionId={questionId} submit={submit} />
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
    </Stack>
  );
};
type question = questionParams & { id: number; creatorId: string };
export const TestQuestion = ({
  questionId,
  submit,
}: {
  questionId: number;
  submit: boolean;
}) => {
  const [question, setQuestion] = useState<question>();
  const init = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/student/questions/${questionId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.question) {
        setQuestion(data.question);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  if (!question) {
    return <>loading...</>;
  }
  return (
    <Card>
      <CardContent>
        <Question
          questionId={question.id}
          question={question.question}
          options={[
            question.option1,
            question.option2,
            question.option3,
            question.option4,
          ]}
          submit={submit}
        />
      </CardContent>
    </Card>
  );
};

const Question = ({
  options,
  question,
  questionId,
  submit,
}: {
  options: string[];
  question: string;
  questionId: number;
  submit: boolean;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const key = `test_question_${questionId}`;
  const [selectedOption, setSelectedOption] = useLocalStorage(key, null);
  const [selectedOptionsStorageKeys, setSelectedOptionsStorageKeys] =
    useRecoilState(_selectedOptionsStorageKeys);
  const answers = useRecoilValue(_answers);
  const testActive = useRecoilValue(_testActive);
  useEffect(() => {
    if (selectedOption && selectedOption.answer)
      setSelected(selectedOption.answer);
  }, []);
  return (
    <FormControl sx={{ width: "100%" }}>
      <Typography variant="h5">{question}</Typography>
      <RadioGroup
        onChange={(e) => {
          if (testActive) {
            e.preventDefault();
            setSelectedOptionsStorageKeys((keys) => {
              const newKeys = keys.filter((k) => k !== key);
              newKeys.push(key);
              return newKeys;
            });
            setSelectedOption({ questionId, answer: e.target.value });
            setSelected(e.target.value);
          }
        }}
        value={selected}
        row
      >
        <Stack
          direction="row"
          justifyContent={"space-evenly"}
          sx={{ width: "100%" }}
        >
          {options.map((option, idx) => {
            return (
              <div key={idx}>
                {submit && (
                  <FormControlLabel
                    value={option}
                    control={
                      <Radio
                        sx={
                          selected === answers?.get(questionId)
                            ? {
                                color: green[800],
                                "&.Mui-checked": {
                                  color: green[600],
                                },
                              }
                            : selected === option
                            ? {
                                color: pink[800],
                                "&.Mui-checked": {
                                  color: pink[600],
                                },
                              }
                            : {}
                        }
                      />
                    }
                    label={option}
                  />
                )}
                {!submit && (
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                )}
              </div>
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
