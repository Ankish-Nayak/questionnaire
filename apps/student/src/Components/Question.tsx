import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { questionParams } from "types";
import {
  Grid,
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { questionCart } from "../store/atoms/questionCart";
import { api } from "../api/api";
type question = Omit<questionParams, "answer"> & { id: number } & {
  creatorId: number;
};
export const Question = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<question>();
  const [add, setAdd] = useState<Boolean>(false);
  const [testQuestions, setTestQuestions] = useRecoilState(questionCart);
  const init1 = async (): Promise<question> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.studentGetQuestion(
          parseInt(questionId as string),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data.question) {
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
    if (
      testQuestions.questions &&
      testQuestions.questions.find((questionId) => questionId === question.id)
    ) {
      setAdd(true);
    } else {
      setAdd(false);
    }
    try {
      const response = await api.studentGetQuestions();
      const data = response.data;
      if (data.questions) {
        const questions = data.questions;
        console.log("creatorId", question.creatorId);
        console.log(questions);
        for (let i = 0; i < questions.length; ++i) {
          if (questions[i].id === question.id) {
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
            {/* <Typography variant={"h6"}>Answer: {question.answer}</Typography> */}
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={() => {
                setAdd((add) => {
                  return !add;
                });
                if (add) {
                  const newTestQuestions: number[] = [];
                  if (testQuestions.questions)
                    testQuestions.questions.forEach((questionId) => {
                      if (question.id !== questionId)
                        newTestQuestions.push(questionId);
                    });
                  setTestQuestions({
                    isLoading: false,
                    questions: newTestQuestions,
                  });
                } else {
                  const newTestQuestions: number[] = [];
                  if (testQuestions.questions)
                    testQuestions.questions.forEach((questionId) => {
                      newTestQuestions.push(questionId);
                    });
                  newTestQuestions.push(question.id);
                  setTestQuestions({
                    isLoading: false,
                    questions: newTestQuestions,
                  });
                }
              }}
            >
              {add ? "remove" : "add"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};
