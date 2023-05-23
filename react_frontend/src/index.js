import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProviderWrapper } from "./ThemeContext";
import AppContextProvider from "./context/AppContextProvider.js";
import { SnackbarProvider } from "notistack";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProviderWrapper>
    <SnackbarProvider maxSnack={3}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </SnackbarProvider>
  </ThemeProviderWrapper>
);

// Register the service worker
serviceWorkerRegistration.register();