import { Radio, FormControlLabel } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../../store/atoms/selectedOptions";
import { answers as _answers } from "../../store/atoms/answers";
import { testActive as _testActive } from "../../store/atoms/testActive";
// it has three states correct answer selected => greeen
// selected button not correct => red
// not selected  => blue default

// type radioStyleType = correct |

export const RadioButton = ({
  answerCorrect,
  option,
  selectedOption,
}: {
  answerCorrect: boolean;
  option: string;
  selectedOption: string;
}) => {
  const [radioStyle, setRadioStyle] = useState<any>({});
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
          color: green[800],
          "&.Mui-checked": {
            color: green[600],
          },
        },
      },
      { key: "notSelectedWrong", val: {} },
    ].map((i) => [i.key, i.val])
  );
  useEffect(() => {
    if (selectedOption === option) {
      if (answerCorrect) {
        setRadioStyle(styleArray.get("correct"));
      } else {
        setRadioStyle(styleArray.get("selectedWrong"));
      }
    } else {
      setRadioStyle(styleArray.get("notSelectedWrong"));
    }
    console.log("render", radioStyle, styleArray);
  }, []);
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
