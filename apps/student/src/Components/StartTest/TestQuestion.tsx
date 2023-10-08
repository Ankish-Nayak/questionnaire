import { Card, CardContent } from "@mui/joy";
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Question } from "./Question";
import { useRecoilValue } from "recoil";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { answers as _answers } from "../../store/atoms/answers";
import { testQuestionFamily } from "../../store/atoms/questionCart";

type question = questionParams & { id: number; creatorId: string };
export const TestQuestion = ({
  questionId,
  submit,
  render,
}: {
  questionId: number;
  submit: boolean;
  render: number;
}) => {
  const [question, setQuestion] = useState<question>();
  const testQuestion = useRecoilValue(testQuestionFamily(questionId));
  const [cardColor, setCardColor] = useState<
    "nuetral" | "danger" | "success" | any
  >();
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
    if (typeof testQuestion.correct === "undefined") {
      setCardColor("nuetral");
    } else {
      setCardColor(testQuestion.correct ? "success" : "danger");
    }
  }, []);
  useEffect(() => {
    if (typeof testQuestion.correct === "undefined") {
      setCardColor("nuetral");
    } else {
      setCardColor(testQuestion.correct ? "success" : "danger");
    }
  }, [testQuestion]);
  if (!question) {
    return <>loading...</>;
  }
  return (
    <Card color={cardColor}>
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
          render={render}
        />
      </CardContent>
    </Card>
  );
};
