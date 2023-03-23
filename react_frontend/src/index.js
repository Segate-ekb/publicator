import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProviderWrapper } from "./ThemeContext";
import AppContextProvider from "./context/AppContextProvider.js";
import { SnackbarProvider } from "notistack";
import * as serviceWorker from "./serviceWorker";

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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
