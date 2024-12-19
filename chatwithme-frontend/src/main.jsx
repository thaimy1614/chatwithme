import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./component/common/ScrollToTop.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
    <div className="position-relative h-100">
      <img
        src="/assets/images/cute-dog.gif"
        alt="Left Animal"
        className="w-15 h-20 position-fixed bottom-0 start-0 mb-2 ms-2"
        width="100"
      />
      <img
        src="/assets/images/cute-panda.gif"
        alt="Right Animal"
        className="w-20 h-20 position-fixed bottom-0 end-0 mb-2 me-2"
        width="100"
      />
    </div>
  </BrowserRouter>
);
