import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context/Index";

const StudentViewCommonHeader = () => {
  const navigate = useNavigate();

  const { resetCredential } = useContext(AuthContext);
  function handleSignOut() {
    sessionStorage.clear();
    resetCredential();
  }

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center">
          <GraduationCap className="h-8 w-8 mr-4 text-black" />
          <span className="font-extrabold md:text-xl text-[14xl]">
            LMS LEARN
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="text-[14px] md:text-[16px]"
            onClick={() => {
              navigate("/courses");
            }}
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div
          onClick={() => navigate("/student-courses")}
          className="flex cursor-pointer space-x-2"
        >
          <span className="font-bold  md:text-xl text-[14xl]">My Courses</span>
          <TvMinimalPlay className="h-8 w-8 mr-3" />
        </div>
        <Button onClick={handleSignOut}>Sign out</Button>
      </div>
    </header>
  );
};

export default StudentViewCommonHeader;
