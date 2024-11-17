import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Index";
import RouteGaurd from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context/Index";
import InstructorDashBoardPage from "./pages/instructor/dashboard";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    // Routes to different Pages
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGaurd
            element={<Auth />}
            authenticated={auth?.authenticated}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGaurd
          element={<InstructorDashBoardPage />}
          authenticated={auth?.authenticated}
          user={auth?.user}
          />
        } 
      />
    <Route
        path="/"
        element={
          <RouteGaurd
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
