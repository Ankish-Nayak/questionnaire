import { useState, useEffect } from "react";
import { questionParams } from "types";
import { Card, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
type question = questionParams & { id: Number };
export const Questions = () => {
  const [questions, setQuestions] = useState<question[]>();

  const init = async () => {
    try {
      const response = await axios.get("/questions", {
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
        justifyContent: "space-between",
      }}
    >
      {questions &&
        questions.map((question) => {
          return <Question question={question} />;
        })}
    </div>
  );
};

export const Question = ({ question }: { question: question }) => {
  const navigate = useNavigate();
  const handleOnClick = async () => {
    navigate(`/${question.id}`);
  };
  return (
    <Card variant={"outlined"}>
      <Typography variant="h5">{question.title}</Typography>
      <Typography variant="body1">{question.description}</Typography>
      {/* <Typography variant="">Created by:{question.}</Typography> */}
      <Button variant={"contained"} size="medium" onClick={handleOnClick}>
        Show more
      </Button>
    </Card>
  );
};
