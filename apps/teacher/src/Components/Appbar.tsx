import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isTeacherLoading,
  teacherEmailState,
} from "../store/selectors/teacher";
import { teacherState } from "../store/atoms/teacher";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const Appbar = () => {
  const teacherLoading = useRecoilValue(isTeacherLoading);
  const teacherName = useRecoilValue(teacherEmailState);
  const setTeacher = useSetRecoilState(teacherState);
  const navigate = useNavigate();
  if (teacherLoading) {
    return <div>Loading...</div>;
  }
  if (teacherName) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Teacher</Typography>
        <Button variant="outlined" size="large" onClick={() => {
            navigate('/questions');
        }}>Questions</Button>
        <Button variant="outlined" size='large' onClick={()=>{
            navigate('/questions/me');
        }}>My Questions</Button>
        <Button variant='outlined' size='large' onClick={() => {
            navigate('/addQuestion')
        }}>Add question</Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "15%",
          }}
        >
          <Typography variant="h5" style={{}}>
            {"ankish"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setTeacher({
                isLoading: false,
                userEmail: null,
              });
              console.log("logout");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4">Teacher</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "15%",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Signup
        </Button>
      </div>
    </div>
  );
};
