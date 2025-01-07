import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/Index";
import InstructorProvider from "./context/instructor-context";
import StudentProvider from "./context/student-context";

createRoot(document.getElementById("root")).render(
  // Here we wrap our entire application under BrowserRouter for routing purpose
  <BrowserRouter>
    {/* Wrapping entire Document in AuthProvider Context API that i wrote customly in context Section  */}
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>
);
