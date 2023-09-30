import { useRecoilValue } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
  Stack,
  Paper,
} from "@mui/material";
import {  questionParams } from "types";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export const TestQuestions = () => {
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
        testQuestions.map((question) => {
          return <TestQuestion questionId={question.id} />;
        })}
      <Button
        variant="contained"
        size="medium"
        sx={{
          alignSelf: "center",
        }}
      >
        Start Test
      </Button>
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
    } catch (e) {}
  };
  useEffect(() => {
    init();
  }, []);
  if (!question) {
    return <></>;
  }
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          margin: "5vh 0vw",
        }}
      >
        <CardContent>
          <Typography variant={"h6"}>{question.question}</Typography>
          <Stack direction={"row"} spacing={2} justifyContent={"space-evenly"}>
            <Item>
              <Typography variant={"body1"}>{question.option1}</Typography>
            </Item>
            <Item>
              <Typography variant={"body1"}>{question.option2}</Typography>
            </Item>
            <Item>
              <Typography variant={"body1"}>{question.option3}</Typography>
            </Item>
            <Item>
              <Typography variant={"body1"}>{question.option4}</Typography>
            </Item>
          </Stack>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
};
