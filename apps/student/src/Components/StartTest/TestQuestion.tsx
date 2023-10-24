import { Card, CardContent } from "@mui/joy";
import { useEffect, useState } from "react";
import { Question } from "./Question";
import { useRecoilValue } from "recoil";
import { testActive as _testActive } from "../../store/atoms/testActive";
import { answers as _answers } from "../../store/atoms/answers";
import { testQuestionFamily } from "../../store/atoms/questionCart";
import { api } from "../../api/api";
import { StudentGetQuestionR } from "node-client/openapi/api";

type question = StudentGetQuestionR;
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
      const response = await api.studentGetQuestion(questionId);
      const data = response.data;
      if (data) {
        setQuestion(data);
        console.log(data); 
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
