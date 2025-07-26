import { AppBar, Toolbar, Typography } from "@mui/material";

export const TodoAppBar = () => {
  return (
    <AppBar position="sticky" color="primary" sx={{ height: 56 }}>
      <Toolbar sx={{ minHeight: 56, px: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Todoアプリ
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
