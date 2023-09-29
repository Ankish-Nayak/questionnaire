import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { questionParams } from "types";
import { Grid, Card, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
type question = questionParams & { id: Number } & { creatorId: Number };
export const Question = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState<question>();
  const [show, setShow] = useState<Boolean>(false);
  const navigate = useNavigate();
  const init1 = async (): Promise<question> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/teacher/questions/${questionId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data.question) {
          setQuestion(data.question);
          resolve(data.question);
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
      const response = await axios.get(`${BASE_URL}/teacher/questions/me`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.questions) {
        const questions = data.questions;
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
    <Grid container>
      <Grid item xl={6}>
        <img
          src="./question-mark.webp"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            // padding: 'auto'
          }}
        />
      </Grid>
      <Grid item xl={6}>
        <Card variant="outlined">
          <Typography variant="h4">{question.title}</Typography>
          <Typography variant="body1">{question.description}</Typography>
          <Typography variant="h5">{question.question}</Typography>
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
          <Typography variant={"h6"}>{question.answer}</Typography>
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
        </Card>
      </Grid>
    </Grid>
  );
};
