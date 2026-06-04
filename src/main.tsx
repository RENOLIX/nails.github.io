import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DefaultProviders } from "./components/providers/default";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DefaultProviders>
      <App />
    </DefaultProviders>
  </React.StrictMode>,
);
