import {
  createTheme,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from "@mui/material";
import React from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#90CAF9",
    },
    secondary: {
      main: "#A5D6A7",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#424242",
      secondary: "#616161",
    },
    info: {
      main: "#CFD8DC",
    },
    warning: {
      main: "#FFCC80",
    },
    error: {
      main: "#EF9A9A",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
      color: "#424242",
    },
    body1: {
      color: "#424242",
    },
    body2: {
      color: "#616161",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense fallback={<LinearProgress />}>{children}</React.Suspense>
    </ThemeProvider>
  );
};
