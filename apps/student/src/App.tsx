import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { studentState } from "./store/atoms/student";
import { BASE_URL } from "./config";
import { useEffect } from "react";
import { Landing } from "./Components/Landing";
import { Appbar } from "./Components/Appbar";
import { Questions } from "./Components/Questions";
import { Question } from "./Components/Question";
import { TestQuestions } from "./Components/TestQuestions";
import { StartTest } from "./Components/StartTest/StartTest.tsx";
import { initState, usePersistStorage } from "./hooks/usePersistedStorage";
import { Profile, EditProfile, Login, Signup } from "ui";
import { testActive as _testActive } from "./store/atoms/testActive.ts";
function App() {
  axios.defaults.withCredentials = true;
  return (
    <RecoilRoot initializeState={initState}>
      <Router>
        <Init />
        <Appbar />
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route
            path={"/signup"}
            element={
              <Signup
                userState={studentState}
                href={`${BASE_URL}/student/signup`}
              />
            }
          />
          <Route
            path={"/login"}
            element={
              <Login
                href={`${BASE_URL}/student/login`}
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
                href={`${BASE_URL}/student/profile`}
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
      const response = await axios.get(`${BASE_URL}/student/me`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.firstname) {
        setStudent({
          isLoading: false,
          userEmail: data.firstname,
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
