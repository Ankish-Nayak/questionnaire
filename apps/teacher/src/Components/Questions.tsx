import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import {
  TeacherGetQuestionWithAnswerR,
  TeacherGetQuestionsR,
} from "node-client/openapi/api";
type question = TeacherGetQuestionsR;
export const Questions = () => {
  const [questions, setQuestions] = useState<question[]>();

  const init = async () => {
    try {
      const response = await api.teacherGetQuestions();
      const data = response.data;
      if (data) {
        setQuestions(data);
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
