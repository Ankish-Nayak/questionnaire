import {
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { questionParams } from "types";
import { api } from "../api/api";
export const EditQuestion = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [option3, setOption3] = useState<string>("");
  const [option4, setOption4] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const { questionId } = useParams();
  const navigate = useNavigate();

  const init = async () => {
    try {
      const response = await api.teacherGetQuestion(
        parseInt(questionId as string)
      );
      const question = response.data;
      if (question) {
        setTitle(question.title);
        setDescription(question.description);
        setAnswer(question.answer);
        setOption1(question.option1);
        setOption2(question.option2);
        setOption3(question.option3);
        setOption4(question.option4);
        setQuestion(question.question);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleOnClick = async () => {
    const options = [option1, option2, option3, option4];
    if (!options.includes(answer)) {
      alert("Enter valid answer");
    } else {
      const questionInputs: questionParams = {
        title,
        description,
        answer,
        option1,
        option2,
        option3,
        option4,
        question,
      };
      try {
        const response = await api.teacherUpdateQuestion(
          parseInt(questionId as string),
          questionInputs,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data.questionId) {
          alert("Question updated successfully");
          navigate(`questions/view/${questionId}`);
        } else {
          alert("Failed to updated the question");
        }
      } catch (e) {
        console.log(e);
        alert("Failed to updated the question");
      }
    }
  };
  return (
    <>
      <Grid
        container
        style={{
          padding: "10vh 10vw",
        }}
      >
        <Grid
          xl={5}
          style={{
            padding: "4vw 3vw",
            // border: "1px solid black",
          }}
        >
          <img
            src="/question-mark.webp"
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
            <CardContent>
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
            </CardContent>
            <CardActions>
              <Button variant="contained" size="medium" onClick={handleOnClick}>
                Update Question
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
