import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  Stack,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { StartTestDialog } from "./StartTestDialog";
import { timer } from "../store/atoms/timer";
import { submit } from "../store/atoms/submit";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import { api } from "../api/api";
import { StudentGetQuestionR } from "node-client/openapi/api";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export const TestQuestions = () => {
  const testQuestions = useRecoilValue(questionCartArray);
  const setTimer = useSetRecoilState(timer);
  const setSubmit = useSetRecoilState(submit);
  const [selectedOptionsStorageKeys, setSelectedOptionsStorageKeys] =
    useRecoilState(_selectedOptionsStorageKeys);
  const handleOnClick = () => {
    selectedOptionsStorageKeys.forEach((key) => localStorage.removeItem(key));
    setSelectedOptionsStorageKeys([]);
    setSubmit(false);
    setTimer({
      isLoading: false,
      show: true,
      startTime: new Date().getTime() / 1000,
      endTime: new Date().getTime() / 1000 + testQuestions.length * 60,
      submitTime: 0,
    });
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
          return <TestQuestion key={idx} questionId={questionId} />;
        })}
      <div style={{ alignSelf: "center" }}>
        <StartTestDialog
          buttonSize="large"
          buttonVariant="outlined"
          handleOnClick={handleOnClick}
        />
      </div>
    </Stack>
  );
};

type question = StudentGetQuestionR;
export const TestQuestion = ({ questionId }: { questionId: number }) => {
  const [question, setQuestion] = useState<question>();

  const init = async () => {
    try {
      const response = await api.studentGetQuestion(questionId);
      const data = response.data;
      if (data) {
        setQuestion(data);
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
