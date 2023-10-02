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
import { useRecoilState } from "recoil";
import { questionCart } from "../store/atoms/questionCart";
type question = questionParams & { id: number };
export const Questions = () => {
  const [questions, setQuestions] = useState<question[]>();
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/questions`, {
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
  const [add, setAdd] = useState<boolean>(false);
  const [testQuestions, setTestQuestions] = useRecoilState(questionCart);
  const handleOnClick = async () => {
    navigate(`/questions/view/${question.id}`);
  };
  useEffect(() => {
    if (
      testQuestions.questions &&
      testQuestions.questions.find((questionId) => questionId === question.id)
    ) {
      setAdd(true);
    } else {
      setAdd(false);
    }
  }, []);
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
        <Button
          variant={"text"}
          size="small"
          sx={{
            fontWeight: "bold",
          }}
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
              // setPersistedQuestionCart(newTestQuestions);
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
              // setPersistedQuestionCart(newTestQuestions);
            }
          }}
        >
          {add ? "remove" : "add"}
        </Button>
      </CardActions>
    </Card>
  );
};
