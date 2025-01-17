import { courseCategories } from "@/config";
import udemy from "../../../assets/udemy.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentBoughtCoursesStatus,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context/Index";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursePage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function getStudentViewCourseList() {
    const response = await fetchStudentViewCourseListService();

    if (response?.success) {
      setStudentViewCoursesList(response.data);
    }
  }

  async function handleCourseClick(courseId) {
    const response = await fetchStudentBoughtCoursesStatus(
      courseId,
      auth?.user._id
    );

    if (response?.status) {
      navigate(`/course-progress/${courseId}`);
    } else {
      navigate(`/courses/details/${courseId}`);
    }
  }

  useEffect(() => {
    getStudentViewCourseList();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 ">
        <div className="lg:w-1/2 lg:pr-12 ">
          <h1 className="text-6xl font-bold mb-4">Learning that's get You</h1>
          <p className="text-xl text-gray-800 mb-5">
            Skills For Your Present And Your Future. Get Started With Us
          </p>
        </div>
        <div className="lg:w-full  mb-8 lg:mb-0 bg-gray-900 rounded-md">
          <img src={udemy} alt="Course" />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Category</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursePage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseClick(courseItem?._id)}
                className="border rounded-lg overflow-hidden cursor-pointer shadow"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    by {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Course Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
