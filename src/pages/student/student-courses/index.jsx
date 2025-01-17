import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context/Index";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentCoursesPage = () => {
  const { studentBoughtList, setStudentBoughtList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleCourseBoughtFetch() {
    const response = await fetchStudentBoughtCoursesService(auth?.user._id);
    setStudentBoughtList(response.courses);
  }

  useEffect(() => {
    handleCourseBoughtFetch();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-4">
        {studentBoughtList && studentBoughtList.length > 0 ? (
          studentBoughtList.map((course) => (
            <Card
              onClick={() => navigate(`/course-progress/${course.courseId}`)}
              key={course.courseId}
              className="flex flex-col"
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course.courseImage}
                  alt={course.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h1 className="font-bold mb-1">{course.title}</h1>
                <p className="text-sm text-gray-700 mb-2 ">
                  {course.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="flex-1">
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1
            className="text-3xl font-bold mt-4
          "
          >
            No Courses Found
          </h1>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
