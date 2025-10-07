import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TurnkeyWrapper } from "./TurnkeyWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TurnkeyWrapper />
  </StrictMode>,
);
