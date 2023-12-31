import { Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, RecoilValueReadOnly } from "recoil";
export const Landing = ({
  userEmailState,
}: {
  userEmailState: RecoilValueReadOnly<string | null>;
}) => {
  const userName = useRecoilValue(userEmailState);
  const navigate = useNavigate();
  return (
    <div
      style={{
        paddingTop: "10vh",
        paddingLeft: "5vw",
        paddingRight: "5vw",
      }}
    >
      <Grid container>
        <Grid
          item
          xl={6}
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "7vh",
            paddingLeft: "4vw",
          }}
        >
          <Typography variant="h4">
            Place, where questions is to be solved.
          </Typography>
          {!userName && (
            <div
              style={{
                paddingTop: "4vh",
                paddingLeft: "3vw",
                display: "flex",
                justifyContent: "space-between",
                width: "30%",
              }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Signup
              </Button>
            </div>
          )}
        </Grid>
        <Grid
          item
          xl={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img src="./image.webp" />
        </Grid>
      </Grid>
    </div>
  );
};
