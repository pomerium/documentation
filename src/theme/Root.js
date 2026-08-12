import {ThemeProvider} from '@mui/material/styles';
import React from 'react';

import App from '../../src/components/App';
import createAppTheme from './muiTheme';

// Root renders outside Docusaurus' ColorModeProvider, so the color mode isn't
// readable here. Components that need dark mode (see ReferenceTable) nest their
// own mode-aware ThemeProvider.
const theme = createAppTheme('light');

export default function Root({children}) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <App children={children} />
      </ThemeProvider>
    </>
  );
}
