import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import { useNavigate } from "react-router-dom";

interface startDialogProps {
  buttonSize?: "large" | "medium" | "small" | undefined;
  buttonVariant?: "text" | "outlined" | "contained" | undefined;
}
export const StartTestDialog = ({
  buttonSize,
  buttonVariant,
}: startDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const testQuestions = useRecoilValue(questionCartArray);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDisagree = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    setOpen(false);
    navigate("/startTest");
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant={buttonVariant}
        onClick={handleClickOpen}
        size={buttonSize}
      >
        Start Test
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="start-test"
        aria-aria-describedby="consent to start test"
      >
        <DialogTitle>{"Want to start test?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6">
              {testQuestions.length} questions are to be solved within{" "}
              {testQuestions.length} minutes
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
