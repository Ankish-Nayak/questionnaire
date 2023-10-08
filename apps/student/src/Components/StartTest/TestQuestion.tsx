import { Card, CardContent } from "@mui/joy";
import { questionParams } from "types";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Question } from "./Question";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
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
  const [testQuestion, setTestQuestion] = useRecoilState(
    testQuestionFamily(questionId)
  );
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

export const useUpdateItems = () => {
  return useRecoilCallback(
    ({ set, snapshot: { getPromise } }) =>
      async (
        newAnswers: Map<number, string>,
        // res: PromiseLike<Map<number, string>> => void
        res: (
          value: Map<number, string> | PromiseLike<Map<number, string>>
        ) => void
      ) => {
        const keys = newAnswers.keys();
        const promises = Array.from(keys).map(async (questionId) => {
          return new Promise<number>(async (res1) => {
            const testQuestion = await getPromise(
              testQuestionFamily(questionId)
            );
            set(testQuestionFamily(questionId), {
              // ...(await getPromise(testQuestionFamily(questionId))),
              questionId: testQuestion.questionId,
              selectedOption: testQuestion.selectedOption,
              answer: newAnswers.get(questionId),
              correct:
                testQuestion.selectedOption === newAnswers.get(questionId),
            });
            res1(questionId);
          });
        });
        Promise.all(promises).then((msgs) => {
          console.log(msgs);
          res(newAnswers);
        });
      },
    []
  );
};

export const useLoadItems = () => {
  return useRecoilCallback(
    ({ snapshot: { getPromise } }) =>
      async (testQuestions: number[]) => {
        return await Promise.all(
          testQuestions.map((questionId) => {
            return new Promise(async (res) => {
              const testQuestion = await getPromise(
                testQuestionFamily(questionId)
              );
              res({
                questionId: testQuestion.questionId,
                answer: testQuestion.selectedOption || "",
              });
            });
          })
        );
      }
  );
};

export const useResetItems = () => {
  return useRecoilCallback(
    ({ set }) =>
      async (testQuestions: number[]) => {
        testQuestions.forEach((questionId) => {
          set(testQuestionFamily(questionId), {
            questionId: questionId,
            selectedOption: undefined,
            answer: undefined,
            correct: undefined,
          });
        });
      },
    []
  );
};
