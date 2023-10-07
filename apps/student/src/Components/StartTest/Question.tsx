import { useRecoilState, useRecoilValue } from "recoil";
import { Stack, Typography, RadioGroup, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { answers as _answers } from "../../store/atoms/answers";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { RadioButton } from "./RadioButton";
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
  const [selected, setSelected] = useState<string | null>(null);
  const key = `test_question_${questionId}`;
  const [selectedOption, setSelectedOption] = useLocalStorage(key, null);
  const [selectedOptionsStorageKeys, setSelectedOptionsStorageKeys] =
    useRecoilState(_selectedOptionsStorageKeys);
  const answers = useRecoilValue(_answers);
  const testActive = useRecoilValue(_testActive);
  //   const [answerCorrect, setAnswerCorrect] = useLocalStorage(
  //     `answer_${questionId}`,
  //     null
  //   );
//   useEffect(() => {
//     if()
//   }, []);
    // useEffect(() => {
    //   if (
    //     answers &&
    //     selectedOption &&
    //     answers.get(questionId) === selectedOption.answer
    //   ) {
    //     setAnswerCorrect(true);
    //   } else {
    //     setAnswerCorrect(false);
    //   }
    // }, [render]);
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
              <RadioButton
                key={idx}
                option={option}
                questionId={questionId}
                // answerCorrect={answerCorrect}
                // selectedOption={selectedOption ? selectedOption.answer : ""}
                render={render}
              />
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
