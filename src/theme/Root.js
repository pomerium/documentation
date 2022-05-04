import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "../../src/components/App";
import { LicenseInfo } from "@mui/x-data-grid-pro";
import { xgrid_key } from "../secret/xgrid-key";
LicenseInfo.setLicenseKey(xgrid_key);

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f43e7",
      light: "#8c69ec",
      dark: "#5936b9",
    },
    secondary: {
      main: "#49AAA1",
      light: "#809BD1",
      dark: "#5176B8",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-toolbarContainer .MuiButtonBase-root": {
            marginLeft: "8px",
            padding: "0, 4px, 0, 4px",
          },
          "& .MuiDataGrid-iconButtonContainer": {
            marginLeft: "10px",
          },
          "& .MuiDataGrid-cell--textLeft": {
            paddingLeft: "15px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600",
          },
          "& .MuiTablePagination-selectLabel": {
            padding: "0px",
            margin: "0px",
          },
          "& .MuiTablePagination-displayedRows": {
            padding: "0px",
            margin: "0px",
          },
        },
      },
    },
  },
});

export default function Root({ children }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <App children={children} />
      </ThemeProvider>
    </>
  );
}
