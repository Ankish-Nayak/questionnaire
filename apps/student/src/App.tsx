import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { studentState } from "./store/atoms/student";
import { BASE_URL } from "./config";
import { useEffect } from "react";
import { Landing } from "./Components/Landing";
import { Signup } from "./Components/Signup";
import { Login } from "./Components/Login";
import { Appbar } from "./Components/Appbar";
import { Questions } from "./Components/Questions";
import { Question } from "./Components/Question";
import { TestQuestions } from "./Components/TestQuestions";
import { StartTest } from "./Components/StartTest";
function App() {
  axios.defaults.withCredentials = true;
  return (
    <RecoilRoot>
      <Router>
        <Init />
        <Appbar />
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={'/questions/view'} element={<Questions/>}/>
          <Route path={`/questions/view/:questionId`} element={<Question/>} />
          <Route path={`/testQuestions/view`} element={<TestQuestions/>}/>
          <Route path={`/startTest`} element={<StartTest/>}/>
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;

export const Init = () => {
  const setStudent = useSetRecoilState(studentState);

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/me`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.username) {
        setStudent({
          isLoading: false,
          userEmail: data.username,
        });
      } else {
        setStudent({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch (e) {
      console.log(e);
      setStudent({
        isLoading: false,
        userEmail: null,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return <></>;
};
