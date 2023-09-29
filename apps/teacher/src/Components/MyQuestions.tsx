import { useState, useEffect } from "react";
import { questionParams } from "types";
import axios from "axios";
import { BASE_URL } from "../config";
import {
  Card,
  Button,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
type question = questionParams & { id: number; creatorId: number };
export const MyQuestions = () => {
  const [questions, setQuestions] = useState<question[]>();

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher/questions/me`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "15vh 10vw",
        justifyContent: "space-evenly",
      }}
    >
      {(questions &&
        questions.map((question) => {
          return <Question question={question} />;
        })) || (
        <Typography variant="h4" textAlign={"center"}>
          No Questions
        </Typography>
      )}
    </div>
  );
};

export const Question = ({ question }: { question: question }) => {
  const navigate = useNavigate();
  const handleOnClick = async () => {
    navigate(`/questions/view/${question.id}`);
  };
  return (
    <Card variant={"outlined"}>
      <CardContent>
        <Typography variant="h5">{question.title}</Typography>
        <Typography variant="body1">{question.description}</Typography>
      </CardContent>
      {/* <Typography variant="">Created by:{question.}</Typography> */}
      <CardActions>
        <Button
          variant={"text"}
          size="small"
          sx={{
            fontWeight: "bold",
          }}
          onClick={handleOnClick}
        >
          Show more
        </Button>
        <Button
          variant={"text"}
          size="small"
          sx={{
            fontWeight: "bold",
          }}
          onClick={() => {
            navigate(`/questions/edit/${question.id}`);
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
