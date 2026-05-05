// Entry point for the React client application
// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import AuthProvider from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PreviewProvider } from "./context/PreviewContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <PreviewProvider>
          <App />
        </PreviewProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);