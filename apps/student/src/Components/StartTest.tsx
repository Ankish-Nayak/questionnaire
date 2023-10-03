import { useRecoilValue } from "recoil";
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
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useLocalStorage } from "../hooks/useLocalStorage";

type selectedOption = Map<number, string>;
export const StartTest = () => {
  const testQuestions = useRecoilValue(questionCartArray);
  const [selectedOptions, setSelectedOptions] = useState<selectedOption>(
    new Map()
  );

  const handleOnClick = async () => {
    const answers: { questionId: number; answer: string }[] = [];
    selectedOptions.forEach((answer, questionId) => {
      answers.push({ questionId, answer });
    });
    console.log(answers);
    // make request to backend
    
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
              selectedOptions={selectedOptions}
            />
          );
        })}
      <Button
        variant="contained"
        size="medium"
        onClick={handleOnClick}
        sx={{
          alignSelf: "center",
        }}
      >
        Submit
      </Button>
    </Stack>
  );
};
type question = questionParams & { id: number; creatorId: string };
export const TestQuestion = ({
  questionId,
  selectedOptions,
}: {
  questionId: number;
  selectedOptions: selectedOption;
}) => {
  const [question, setQuestion] = useState<question>();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const onSelectedOptionChange = (newSelectedOption: string) => {
    setSelectedOption(newSelectedOption);
    selectedOptions.set(questionId, newSelectedOption);
  };
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
          onSelectedOptionChange={onSelectedOptionChange}
        />
      </CardContent>
    </Card>
  );
};

const Question = ({
  options,
  question,
  questionId,
  onSelectedOptionChange,
}: {
  options: string[];
  question: string;
  questionId: Number;
  onSelectedOptionChange: (newSelectedOption: string) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [persistedSelected, setPersistedSelected] = useLocalStorage(
    `test_question_${questionId}`,
    null
  );

  useEffect(() => {
    setSelected(persistedSelected);
    onSelectedOptionChange(persistedSelected);
  }, [selected]);
  return (
    <FormControl sx={{ width: "100%" }}>
      <Typography variant="h5">{question}</Typography>
      <RadioGroup
        onChange={(e) => {
          e.preventDefault();
          setPersistedSelected(e.target.value);
          setSelected(e.target.value);
          onSelectedOptionChange(e.target.value);
          console.log(e.target.value);
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
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              </div>
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
