import {createTheme} from '@mui/material/styles';

// Keep MUI's surfaces and primary color aligned with Infima's, so MUI
// components blend into the docs theme in both color modes. The values mirror
// the Infima defaults and the dark `--ifm-color-primary` from src/css/custom.css.
const paletteByMode = {
  light: {
    primary: {main: '#6f43e7', light: '#8c69ec', dark: '#5936b9'},
    background: {default: '#ffffff', paper: '#ffffff'},
  },
  dark: {
    primary: {main: '#b296ff', light: '#c5b1ff', dark: '#7d56e9'},
    background: {default: '#1b1b1d', paper: '#242526'},
  },
};

export default function createAppTheme(mode = 'light') {
  const {primary, background} = paletteByMode[mode] ?? paletteByMode.light;

  return createTheme({
    palette: {
      mode,
      primary,
      background,
      secondary: {
        main: '#49AAA1',
        light: '#809BD1',
        dark: '#5176B8',
      },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-toolbarContainer .MuiButtonBase-root': {
              marginLeft: '8px',
              padding: '0, 4px, 0, 4px',
            },
            '& .MuiDataGrid-iconButtonContainer': {
              marginLeft: '10px',
            },
            '& .MuiDataGrid-cell--textLeft': {
              paddingLeft: '15px',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: '600',
            },
            '& .MuiTablePagination-selectLabel': {
              padding: '0px',
              margin: '0px',
            },
            '& .MuiTablePagination-displayedRows': {
              padding: '0px',
              margin: '0px',
            },
          },
        },
      },
    },
  });
}
