import { Radio, FormControlLabel } from "@mui/material";
import { green, pink } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { answers as _answers } from "../../store/atoms/answers";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useRecoilValue } from "recoil";
// it has three states correct answer selected => greeen
// selected button not correct => red
// not selected  => blue default

// type radioStyleType = correct |

export const RadioButton = ({
  option,
  questionId,
  render,
}: {
  option: string;
  questionId: number;
  render: number;
}) => {
  const [radioStyle, setRadioStyle] = useState<any>({});
  const [selectedOption, setSelectedOption] = useLocalStorage(
    `test_question_${questionId}`,
    null
  );
  const answers = useRecoilValue(_answers);
  const [answerCorrect, setAnswerCorrect] = useState<boolean>(false);
  const styleArray = new Map(
    [
      {
        key: "correct",
        val: {
          color: green[800],
          "&.Mui-checked": {
            color: green[600],
          },
        },
      },
      {
        key: "selectedWrong",
        val: {
          color: pink[800],
          "&.Mui-checked": {
            color: pink[600],
          },
        },
      },
      { key: "notSelectedWrong", val: {} },
      {
        key: "notSelectedRight",
        val: {
          color: green[800],
          "&.Mui-checked": {
            color: green[600],
          },
        },
      },
    ].map((i) => [i.key, i.val])
  );
  const settingRadioStyle = (): void => {
    if (selectedOption && selectedOption.answer === option) {
      if (answers && answers.get(questionId) === option) {
        setAnswerCorrect(true);
        setRadioStyle(styleArray.get("correct"));
      } else if (answers && answers.get(questionId) !== option) {
        setRadioStyle(styleArray.get("selectedWrong"));
      } else {
        setRadioStyle(styleArray.get("notSelectedWrong"));
      }
    } else if (answers && answers.get(questionId) === option) {
      setRadioStyle(styleArray.get("notSelectedRight"));
    } else {
      setRadioStyle(styleArray.get("notSelectedWrong"));
    }
  };
  useEffect(() => {
    settingRadioStyle();
  }, [render]);
  useEffect(() => {
    settingRadioStyle();
  }, [answerCorrect]);
  useEffect(() => {
    settingRadioStyle();
    console.log(
      questionId,
      JSON.stringify(radioStyle),
      styleArray,
      answerCorrect,
      selectedOption,
      answers
    );
  }, [render]);
  useEffect(() => {
    console.log("render", render);
  }, [render]);
  return (
    <div>
      <FormControlLabel
        value={option}
        control={<Radio sx={radioStyle} />}
        label={option}
      />
    </div>
  );
};
