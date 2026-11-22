// The very first file that runs in the browser. Its only job is to find
// the <div id="root"> in index.html and render the <App /> component into
// it, wrapped in a router so pages can navigate between URLs.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* future flags opt in early to react-router v7's behavior, so there's
        nothing to migrate later and no console warnings today. */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
