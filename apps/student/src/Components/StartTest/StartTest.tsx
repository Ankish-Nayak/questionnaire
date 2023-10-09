import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { questionCartArray } from "../../store/selectors/questionCart";
import { questionCart as _questionCart } from "../../store/atoms/questionCart";
import { Stack, Button } from "@mui/material";
import { useState } from "react";
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
import CustomizedDialogs from "../TestSummaryDialog";
import { testSummaryDialog as _testSummaryDialog } from "../../store/atoms/testSummaryDialog";
import { TestQuestion } from "./TestQuestion";
import { testCompleteDialog as _testCompleteDialog } from "../../store/atoms/testCompleteDialog";
import { TestCompleteDialog } from "../TestCompleteDialog";
export const StartTest = () => {
  const testQuestions = useRecoilValue(questionCartArray);
  const submit = useRecoilValue(_submit);
  const [timeOuts, setTimeOuts] = useRecoilState(_timeOuts);
  const [timeIntervals, setTimeIntervals] = useRecoilState(_timeIntervals);
  const handleShowAnswers = async () => {
    Promise.all(clearIntervals(timeOuts)).then((msgs) => console.log(msgs));
    Promise.all(clearTimeouts(timeIntervals)).then((msgs) => console.log(msgs));
    setTimeOuts([]);
    setTimeIntervals([]);
    setRender(new Date().getTime());
  };
  const [render, setRender] = useState<number>(new Date().getTime());
  const setTestCompleteDialog = useSetRecoilState(_testCompleteDialog);
  const handleSubmit = () => {
    setTestCompleteDialog(true);
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
              render={render}
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
      <CustomizedDialogs />
      <TestCompleteDialog />
    </Stack>
  );
};
