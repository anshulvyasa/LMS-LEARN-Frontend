import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Index";
import RouteGaurd from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context/Index";
import InstructorDashBoardPage from "./pages/instructor/dashboard";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import Not_Found from "./pages/not-found";
import AddNewCourse from "./pages/instructor/add_new_course";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    // Routes to different Pages
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGaurd
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<Auth />}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGaurd
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<InstructorDashBoardPage />}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGaurd
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<AddNewCourse />}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGaurd
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<AddNewCourse />}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGaurd
            authenticated={auth?.authenticate}
            user={auth?.user}
            element={<StudentViewCommonLayout />}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
      </Route>
      <Route path="*" element={<Not_Found />} />
    </Routes>
  );
}

export default App;
