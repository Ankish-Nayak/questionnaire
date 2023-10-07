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
  const [answerCorrect, setAnswerCorrect] = useState<boolean>(false);
  useEffect(() => {
    if (selectedOption && selectedOption.answer)
      setSelected(selectedOption.answer);
    if (
      answers &&
      selectedOption &&
      answers.get(questionId) === selectedOption.answer
    ) {
      setAnswerCorrect(true);
    }
  }, []);
  useEffect(() => {
    if (
      answers &&
      selectedOption &&
      answers.get(questionId) === selectedOption.answer
    ) {
      setAnswerCorrect(true);
    }
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
              <RadioButton
                key={idx}
                option={option}
                answerCorrect={answerCorrect}
                selectedOption={selectedOption ? selectedOption.answer : ""}
              />
            );
          })}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};
