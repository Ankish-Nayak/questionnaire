import { useRecoilValue } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import { Stack, Card, CardContent, Typography, Paper } from "@mui/material";
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { styled } from "@mui/material/styles";

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
        <Typography variant="h5">{question.question}</Typography>
        <Stack direction="row" justifyContent={"space-evenly"}>
          <Item>{question.option1}</Item>
          <Item>{question.option2}</Item>
          <Item>{question.option3}</Item>
          <Item>{question.option4}</Item>
        </Stack>
      </CardContent>
    </Card>
  );
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
