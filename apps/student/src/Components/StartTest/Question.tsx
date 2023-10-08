import { useRecoilState, useRecoilValue } from "recoil";
import { Stack, Typography, RadioGroup, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { answers as _answers } from "../../store/atoms/answers";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { RadioButton } from "./RadioButton";
import { testQuestionFamily } from "../../store/atoms/questionCart";
export const Question = ({
  options,
  question,
  questionId,
  render,
}: {
  options: string[];
  question: string;
  questionId: number;
  submit: boolean;
  render: number;
}) => {
  const [testQuestion, setTestQuestion] = useRecoilState(
    testQuestionFamily(questionId)
  );
  const testActive = useRecoilValue(_testActive);
  const [selected, setSelected] = useState<undefined | string>(
    testActive === "starts" ? undefined : testQuestion.selectedOption
  );
  useEffect(() => {
    if (testActive === "starts") {
      setTestQuestion({
        questionId: questionId,
        correct: undefined,
        answer: undefined,
        selectedOption: undefined,
      });
      setSelected(undefined);
    }
  }, [testActive]);
  return (
    <FormControl sx={{ width: "100%" }}>
      <Typography variant="h5">{question}</Typography>
      <RadioGroup
        onChange={(e) => {
          if (testActive !== "ended") {
            console.log("changing");
            e.preventDefault();
            setTestQuestion({
              ...testQuestion,
              selectedOption: e.target.value,
            });
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
              <RadioButton
                key={idx}
                option={option}
                questionId={questionId}
                selected={selected}
                render={render}
              />
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
