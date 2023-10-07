import { Card, CardContent } from "@mui/material";
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Question } from "./Question";

type question = questionParams & { id: number; creatorId: string };
export const TestQuestion = ({
  questionId,
  submit,
}: {
  questionId: number;
  submit: boolean;
}) => {
  const [question, setQuestion] = useState<question>();
  const init = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/student/questions/${questionId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.question) {
        setQuestion(data.question);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  if (!question) {
    return <>loading...</>;
  }
  return (
    <Card>
      <CardContent>
        <Question
          questionId={question.id}
          question={question.question}
          options={[
            question.option1,
            question.option2,
            question.option3,
            question.option4,
          ]}
          submit={submit}
        />
      </CardContent>
    </Card>
  );
};
