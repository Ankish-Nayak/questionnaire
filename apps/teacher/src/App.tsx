import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSetRecoilState, RecoilRoot } from "recoil";
import { teacherState } from "./store/atoms/teacher";
import { useEffect } from "react";
import { Appbar } from "./Components/Appbar";
import { Questions } from "./Components/Questions";
import { Question } from "./Components/Question";
import { AddQuestion } from "./Components/AddQuestion";
import { EditQuestion } from "./Components/EditQuestion";
import { MyQuestions } from "./Components/MyQuestions";
import { Profile, EditProfile, Login, Signup } from "ui";
import { Landing } from "ui";
import { teacherEmailState } from "./store/selectors/teacher";
import { api } from "./api/api";
function App() {
  return (
    <>
      <RecoilRoot>
        <Router>
          <Init />
          <Appbar />
          <Routes>
            <Route
              path={"/"}
              element={<Landing userEmailState={teacherEmailState} />}
            />
            <Route
              path={"/signup"}
              element={
                <Signup
                  user="teacher"
                  // href={`${BASE_URL}/teacher/signup`}
                  userState={teacherState}
                />
              }
            />
            <Route
              path={"/login"}
              element={
                <Login
                  user="teacher"
                  // href={`${BASE_URL}/teacher/login`}
                  userState={teacherState}
                />
              }
            />
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
            <Route path={"/profile"} element={<Profile user="teacher" />} />
            <Route
              path={"/profile/edit"}
              element={<EditProfile user="teacher" userState={teacherState} />}
            />
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
      const response = await api.studentGetFirstname();
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
