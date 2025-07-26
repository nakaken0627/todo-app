import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { FilterStatus } from "../types/todo";

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  fetchTodos: (status: FilterStatus) => Promise<void>;
};

export const ToggleTodoButton = ({
  filterStatus,
  setFilterStatus,
  fetchTodos,
}: Props) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ToggleButtonGroup
        value={filterStatus}
        exclusive
        onChange={(_event, selectedStatus) => {
          if (selectedStatus !== null) {
            fetchTodos(selectedStatus);
          }
          setFilterStatus(selectedStatus);
        }}
        aria-label="todo status filter"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ToggleButton
          value="all"
          aria-label="all todos"
          sx={{ flex: 1, minWidth: 0, px: 1 }}
        >
          <DoneAllIcon sx={{ mr: 1 }} /> 全て
        </ToggleButton>
        <ToggleButton
          value="completed"
          aria-label="completed todos"
          sx={{ flex: 1, minWidth: 0, px: 1 }}
        >
          <CheckCircleOutlineIcon sx={{ mr: 1 }} /> 完了
        </ToggleButton>
        <ToggleButton
          value="uncompleted"
          aria-label="uncompleted todos"
          sx={{ flex: 1, minWidth: 0, px: 1 }}
        >
          <RadioButtonUncheckedIcon sx={{ mr: 1 }} /> 未完了
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
