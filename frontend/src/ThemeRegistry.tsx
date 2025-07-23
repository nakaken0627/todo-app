import {
  createTheme,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from "@mui/material";
import React from "react";

const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#64B5F6",
      contrastText: "#fff",
    },
    secondary: {
      main: "#81C784",
      contrastText: "#fff",
    },
    background: {
      default: "#E0F2F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#37474F",
      secondary: "#607D8B",
    },
  },
  typography: {
    fontFamily: [
      "Noto Sans JP",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 600,
      fontSize: "1.3rem",
    },
    body1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    button: {
      fontWeight: 600,
    },
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "20px",
          padding: "8px 20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          backgroundColor: "#E8F5E9",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          padding: "6px 8px",
          "&.Mui-selected": {
            backgroundColor: baseTheme.palette.primary.main,
            color: "#fff",
            "&:hover": {
              backgroundColor: baseTheme.palette.primary.dark,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          marginBottom: baseTheme.spacing(1),
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
          "&:last-child": {
            marginBottom: 0,
          },
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
