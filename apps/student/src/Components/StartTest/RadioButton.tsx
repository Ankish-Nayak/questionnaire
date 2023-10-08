import { Radio, FormControlLabel } from "@mui/material";
import { green, pink } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { answers as _answers } from "../../store/atoms/answers";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { useRecoilValue } from "recoil";
import { testQuestionFamily } from "../../store/atoms/questionCart";
// it has three states correct answer selected => greeen
// selected button not correct => red
// not selected  => blue default

// type radioStyleType = correct |

export const RadioButton = ({
  option,
  questionId,
  render,
  selected,
}: {
  option: string;
  questionId: number;
  render: number;
  selected: string | undefined;
}) => {
  const [radioStyle, setRadioStyle] = useState<any>({});
  const testQuestion = useRecoilValue(testQuestionFamily(questionId));
  const testActive = useRecoilValue(_testActive);

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
    if (testQuestion.selectedOption === option) {
      if (typeof testQuestion.correct === "undefined") {
        setRadioStyle(styleArray.get("notSelectedWrong"));
      } else {
        setRadioStyle(
          testQuestion.correct
            ? styleArray.get("correct")
            : styleArray.get("selectedWrong")
        );
      }
    }
  };
  useEffect(() => {
    settingRadioStyle();
  }, []);
  useEffect(() => {
    settingRadioStyle();
  }, [testQuestion]);
  useEffect(() => {
    if (testActive === "starts") {
      setRadioStyle({});
    } else {
      settingRadioStyle();
    }
    console.log(
      questionId,
      JSON.stringify(radioStyle),
      styleArray,
      testQuestion
    );
  }, [testActive, selected, testQuestion]);
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
