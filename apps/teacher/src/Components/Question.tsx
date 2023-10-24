import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  CardContent,
  CardActionArea,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { TeacherGetQuestionWithAnswerR } from "node-client/openapi/api";
type question = TeacherGetQuestionWithAnswerR;
export const Question = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<question>();
  const [show, setShow] = useState<Boolean>(false);
  const navigate = useNavigate();
  const init1 = async (): Promise<question> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.teacherGetQuestion(parseInt(questionId as string));
        const data = response.data;
        if (data) {
          setQuestion(data);
          resolve(data);
        }
      } catch (e) {
        const errObj = {
          msg: "An error occurred",
          err: e,
        };
        console.log(errObj);
        reject(errObj);
      }
    });
  };
  const init2 = async (question: question) => {
    try {
      const response = await api.teacherGetQuestions();
      const data = response.data;
      if (data) {
        const questions = data;
        console.log("creatorId", question.creatorId);
        console.log(questions);
        setShow(false);
        for (let i = 0; i < questions.length; ++i) {
          if (questions[i].id === question.id) {
            setShow(true);
            break;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init1().then((question) => {
      init2(question);
    });
  }, []);
  if (!question) {
    return <>404</>;
  }
  return (
    <Grid
      container
      style={{
        padding: "10vh 10vw",
      }}
    >
      <Grid
        item
        xl={6}
        style={{
          padding: " 0 3vw",
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
      <Grid
        item
        xl={6}
        style={{
          padding: "0 4vw",
        }}
      >
        <Card
          variant="outlined"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid black",
          }}
        >
          <CardContent>
            <Typography variant="h4">Title: {question.title}</Typography>
            <Typography variant="body1">
              Description: {question.description}
            </Typography>
            <Typography variant="h5">Question: {question.question}</Typography>

            <div
              style={
                {
                  // display: "flex",
                  // flexDirection: "row",
                }
              }
            >
              <Typography variant="h6">{"Options:"}</Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Typography variant={"h6"}>{question.option1}</Typography>
                <Typography variant={"h6"}>{question.option2}</Typography>
                <Typography variant={"h6"}>{question.option3}</Typography>
                <Typography variant={"h6"}>{question.option4}</Typography>
              </div>
            </div>
            <Typography variant={"h6"}>Answer: {question.answer}</Typography>
          </CardContent>
          <CardActions>
            {show && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/questions/edit/${question.id}`);
                }}
              >
                Edit
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};
