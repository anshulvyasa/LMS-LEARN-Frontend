import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing-page";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-setting";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/curriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useContext, useEffect } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context/Index";
import {
  addNewCourseService,
  fetchInstructorCourseDetailService,
  updateCourseByIdService,
} from "@/services";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCourse() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  async function fetchCurrentCourseDetail(p) {
    const response = await fetchInstructorCourseDetailService(
      currentEditedCourseId
    );

   

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetail();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  //Helper function for validateFormData function
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.vedioUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const finalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      Student: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    

    const response =currentEditedCourseId!=null?await updateCourseByIdService(currentEditedCourseId,finalFormData): await addNewCourseService(finalFormData);

    if (response?.success) {
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCourseLandingFormData(courseLandingInitialFormData);
      setCurrentEditedCourseId(null);
      navigate(-1);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between ">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData()}
          onClick={handleCreateCourse}
          className="text-sm tracking-wider font-bold px-8 uppercase"
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4 ">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum" className="mr-4">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="course-landing-page" className="mr-4">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCourse;
