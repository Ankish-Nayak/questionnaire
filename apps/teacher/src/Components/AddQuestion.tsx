import { useState } from "react";
import { questionParams } from "types";
import { BASE_URL } from "../config";
import axios from "axios";
import { Card, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const AddQuestion = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [option3, setOption3] = useState<string>("");
  const [option4, setOption4] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const navigate = useNavigate();

  const handleOnClick = async () => {
    const optionArray = [option1, option2, option3, option4];
    const questionInput: questionParams = {
      title,
      description,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
    };
    if (optionArray.includes(answer)) {
      try {
        const response = await axios.post(
          `${BASE_URL}/questions`,
          JSON.stringify(questionInput),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data.questionId) {
          alert("Question has been added");
          navigate("/questions");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Answer dosen't match any of the given options");
    }
  };

  return (
    <div>
      <Card variant="outlined">
        <TextField
          variant="outlined"
          label="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="option1"
          value={option1}
          onChange={(e) => {
            setOption1(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="option2"
          value={option2}
          onChange={(e) => {
            setOption2(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="Option3"
          value={option3}
          onChange={(e) => {
            setOption3(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="Option4"
          value={option4}
          onChange={(e) => {
            setOption4(e.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="answer"
          value={answer}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Button variant="contained" size="medium" onClick={handleOnClick}>
          Create Question
        </Button>
      </Card>
    </div>
  );
};
