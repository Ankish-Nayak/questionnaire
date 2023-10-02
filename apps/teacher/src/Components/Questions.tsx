import { useState, useEffect } from "react";
import { questionParams } from "types";
import {
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
type question = questionParams & { id: Number };
export const Questions = () => {
  const [questions, setQuestions] = useState<question[]>();

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher/questions`, {
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
      // setQuestions()
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
        questions.map((question, idx) => {
          return <Question key={idx} question={question} />;
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
      </CardActions>
    </Card>
  );
};
