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
} from "@mui/material";
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useLocalStorage } from "../hooks/useLocalStorage";

// introducing save state using localstorage
export const StartTest = () => {
  const testQuestions = useRecoilValue(questionCartArray);
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
          return <TestQuestion key={idx} questionId={questionId} />;
        })}
    </Stack>
  );
};
type question = questionParams & { id: Number; creatorId: string };
export const TestQuestion = ({ questionId }: { questionId: Number }) => {
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
        />
      </CardContent>
    </Card>
  );
};

const Question = ({
  options,
  question,
  questionId,
}: {
  options: string[];
  question: string;
  questionId: Number;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [persistedSelected, setPersistedSelected] = useLocalStorage(
    `test_question_${questionId}`,
    null
  );

  useEffect(() => {
    setSelected(persistedSelected);
  }, [selected]);
  return (
    <FormControl sx={{ width: "100%" }}>
      <Typography variant="h5">{question}</Typography>
      <RadioGroup
        onChange={(e) => {
          e.preventDefault();
          setPersistedSelected(e.target.value);
          setSelected(e.target.value);
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
