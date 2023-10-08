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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { questionCartArray } from "../store/selectors/questionCart";
import { useNavigate } from "react-router-dom";
import { submit } from "../store/atoms/submit";
import { testActive as _testActive } from "../store/atoms/testActive";
import { selectedOptionsStorageKeys as _selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";

interface startDialogProps {
  buttonSize?: "large" | "medium" | "small" | undefined;
  buttonVariant?: "text" | "outlined" | "contained" | undefined;
  handleOnClick: () => void;
}
export const StartTestDialog = ({
  buttonSize,
  buttonVariant,
  handleOnClick,
}: startDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const testQuestions = useRecoilValue(questionCartArray);
  const navigate = useNavigate();
  const setSubmit = useSetRecoilState(submit);
  const setTestActive = useSetRecoilState(_testActive);
  const handleClickOpen = () => {
    setSubmit(false);
    setOpen(true);
    setTestActive("starts");
  };

  const handleDisagree = () => {
    setOpen(false);
    setTestActive("ended");
  };

  const handleAgree = () => {
    handleOnClick();
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
      <Dialog open={open} onClose={handleClose}>
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
