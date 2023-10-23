import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { studentState } from "./store/atoms/student";
import { BASE_URL } from "./config";
import { useEffect } from "react";
import { Appbar } from "./Components/Appbar";
import { Questions } from "./Components/Questions";
import { Question } from "./Components/Question";
import { TestQuestions } from "./Components/TestQuestions";
import { StartTest } from "./Components/StartTest/StartTest.tsx";
import { initState, usePersistStorage } from "./hooks/usePersistedStorage";
import { Profile, EditProfile, Login, Signup } from "ui";
import { testActive as _testActive } from "./store/atoms/testActive.ts";
import { Landing } from "ui";
import { studentEmailState } from "./store/selectors/student.ts";
import { api } from "./api/api.ts";
function App() {
  axios.defaults.withCredentials = true;
  return (
    <RecoilRoot initializeState={initState}>
      <Router>
        <Init />
        <Appbar />
        <Routes>
          <Route
            path={"/"}
            element={<Landing userEmailState={studentEmailState} />}
          />
          <Route
            path={"/signup"}
            element={
              <Signup
                userState={studentState}
                user="student"
                // href={`${BASE_URL}/student/signup`}
              />
            }
          />
          <Route
            path={"/login"}
            element={
              <Login
                user="student"
                // href={`${BASE_URL}/student/login`}
                userState={studentState}
                _testActive={_testActive}
              />
            }
          />
          <Route path={"/questions/view"} element={<Questions />} />
          <Route path={`/questions/view/:questionId`} element={<Question />} />
          <Route path={`/testQuestions/view`} element={<TestQuestions />} />
          <Route path={`/startTest`} element={<StartTest />} />
          <Route
            path={"/profile"}
            element={<Profile href={`${BASE_URL}/student/profile`} />}
          />
          <Route
            path={"/profile/edit"}
            element={
              <EditProfile
                user="student"
                // href={`${BASE_URL}/student/profile`}
                userState={studentState}
              />
            }
          />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;

export const Init = () => {
  const setStudent = useSetRecoilState(studentState);
  usePersistStorage();
  const init = async () => {
    try {
      const res = await api.studentGetFirstname();
      setStudent({
        isLoading: false,
        userEmail: res.data.firstname,
      });
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
