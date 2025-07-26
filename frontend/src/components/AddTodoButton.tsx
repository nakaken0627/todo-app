import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  onClick: () => void;
};

export const AddTodoButton = ({ onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1300,
        borderRadius: "50px",
        px: 3,
        py: 1.5,
      }}
    >
      新規登録
    </Button>
  );
};
