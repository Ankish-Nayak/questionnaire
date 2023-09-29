import { useState } from "react";
import { questionParams } from "types";
import { BASE_URL } from "../config";
import axios from "axios";
import { Card, TextField, Button, Grid } from "@mui/material";
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
          `${BASE_URL}/teacher/questions`,
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
    <div
      style={{
        padding: "5vh 10vw 0 10vw",
      }}
    >
      <Grid
        container
        style={{
          // border: "1px solid black",
        }}
      >
        <Grid
          xl={5}
          style={{
            padding: '4vw 3vw'
            // border: "1px solid black",
          }}
        >
          <img
            src="./question-mark.webp"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              // padding: 'auto'
            }}
          />
        </Grid>
        <Grid xl={7}>
          <Card
            variant="outlined"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1vh 5vw",
              margin: "auto",
            }}
          >
            <TextField
              variant="outlined"
              label="Enter tag"
              value={title}
              fullWidth={true}
              margin="dense"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Enter question"
              value={question}
              fullWidth={true}
              margin="dense"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              multiline
              maxRows={4}
            />
            <TextField
              variant="outlined"
              margin="dense"
              label="Describe question"
              multiline
              maxRows={4}
              fullWidth={true}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "1vw 0 1vw 0",
              }}
            >
              <TextField
                variant="outlined"
                label="First option"
                margin="dense"
                value={option1}
                fullWidth={true}
                onChange={(e) => {
                  setOption1(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                label="Second option"
                value={option2}
                margin="dense"
                fullWidth={true}
                onChange={(e) => {
                  setOption2(e.target.value);
                }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="Third option"
                value={option3}
                fullWidth={true}
                onChange={(e) => {
                  setOption3(e.target.value);
                }}
              />
              <TextField
                margin="dense"
                variant="outlined"
                label="Fourth option"
                value={option4}
                fullWidth={true}
                onChange={(e) => {
                  setOption4(e.target.value);
                }}
              />
            </div>
            <TextField
              variant="outlined"
              label="answer"
              value={answer}
              helperText={"Enter answer"}
              fullWidth={true}
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            />
            <Button variant="contained" size="medium" onClick={handleOnClick}>
              Create Question
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
