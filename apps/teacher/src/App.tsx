import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSetRecoilState, RecoilRoot } from "recoil";
import { teacherState } from "./store/atoms/teacher";
import axios from "axios";
import { BASE_URL } from "./config";
import { useEffect } from "react";
import { Appbar } from "./Components/Appbar";
import { Signup } from "./Components/Signup";
import { Landing } from "./Components/Landing";
import { Login } from "./Components/Login";
import { Questions } from "./Components/Questions";
import { Question } from "./Components/Question";
import { AddQuestion } from "./Components/AddQuestion";
import { EditQuestion } from "./Components/EditQuestion";
import { MyQuestions } from "./Components/MyQuestions";

function App() {
  axios.defaults.withCredentials = true;
  return (
    <>
      <RecoilRoot>
        <Router>
          <Init />
          <Appbar />
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/questions"} element={<Questions />} />
            <Route
              path={"/questions/view/:questionId"}
              element={<Question />}
            />
            <Route
              path={"/questions/edit/:questionId"}
              element={<EditQuestion />}
            />
            <Route path={"/questions/me"} element={<MyQuestions />} />
            <Route path={"/addQuestion"} element={<AddQuestion />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
}

export default App;

export const Init = () => {
  const setTeacher = useSetRecoilState(teacherState);

  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher/me`);
      const data = response.data;
      if (data.firstname) {
        setTeacher({
          isLoading: false,
          userEmail: data.firstname,
        });
      } else {
        setTeacher({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch (e) {
      setTeacher({
        isLoading: false,
        userEmail: null,
      });
      console.log(e);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return <></>;
};
