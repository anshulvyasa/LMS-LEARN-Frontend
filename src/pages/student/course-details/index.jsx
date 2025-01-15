import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VedioPlayer from "@/components/vedio-player";
import { AuthContext } from "@/context/auth-context/Index";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentBoughtCoursesStatus,
  fetchStudentViewCourseDetailService,
} from "@/services";
import { CheckCheck, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentViewCourseDetailPage = () => {
  const {
    studentViewCourseDetail,
    setStudentViewCourseDetail,
    currentCourseDetailId,
    setCurrentCourseDetailId,
    studentLoading,
    setStudentLoading,
  } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);

  //States Are Defined Here
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approveUrl, setApproveUrl] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchStudentViewCourseDetails() {
    setStudentLoading(true);
    const response = await fetchStudentViewCourseDetailService(
      currentCourseDetailId
    );

    if (response?.success) setStudentViewCourseDetail(response?.data);
    else setStudentViewCourseDetail(null);

    setStudentLoading(false);
  }

  function handleSetFreePreview(getCurrentVedioInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVedioInfo.vedioUrl);
    setShowFreePreviewDialog(true);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user._id,
      userName: auth?.user.userName,
      userEmail: auth?.user.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instrutorId: studentViewCourseDetail?.instructorId,
      instructorName: studentViewCourseDetail?.instructorName,
      courseImage: studentViewCourseDetail?.image,
      courseTitle: studentViewCourseDetail?.title,
      courseId: studentViewCourseDetail?._id,
      coursePricing: studentViewCourseDetail?.pricing,
    };

    const response = await createPaymentService(paymentPayload);
    if (response?.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApproveUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (currentCourseDetailId !== null) fetchStudentViewCourseDetails();

    return () => {
      setCurrentCourseDetailId(null);
      setStudentViewCourseDetail(null);
    };
  }, [currentCourseDetailId]);

  async function checkIfCourseIsAlreadyBought() {
    if (id) setCurrentCourseDetailId(id);

    const response = await fetchStudentBoughtCoursesStatus(id, auth?.user._id);
    if (response?.status) {
      navigate(`/course-progress/${id}`);
    }
  }

  useEffect(() => {
    checkIfCourseIsAlreadyBought();
  }, [id]);

  const getIndexOfFreePreviewURL =
    studentViewCourseDetail !== null
      ? studentViewCourseDetail?.curriculum.findIndex(
          (item) => item.freePreview
        )
      : -1;

  if (studentLoading) return <Skeleton />;
  if (approveUrl !== "") window.location.href = approveUrl;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-2">
          {studentViewCourseDetail?.title}
        </h1>
        <p className="text-xl mb-2">{studentViewCourseDetail?.subtitle}</p>
        <div className="flex items-center space-x-2 mt-2 text-sm ">
          <span>Created By {studentViewCourseDetail?.instructorName}</span>
          <span>Created On {studentViewCourseDetail?.date.split("T")[0]}</span>
          <span className="flex items-center ">
            <Globe className="mr-1 h-4 w-4 " />
            {studentViewCourseDetail?.primaryLanguage.toUpperCase()}
          </span>
          <span>
            {studentViewCourseDetail?.Student.length}{" "}
            {studentViewCourseDetail?.Student <= 1 ? "Student" : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetail?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetail?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <Lock className="h-5 w-5 mr-2" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VedioPlayer
                  url={
                    getIndexOfFreePreviewURL !== -1
                      ? studentViewCourseDetail?.curriculum[
                          getIndexOfFreePreviewURL
                        ].vedioUrl
                      : ""
                  }
                />
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold ">
                  ${studentViewCourseDetail?.pricing}
                </span>
              </div>
              <Button className="w-full" onClick={handleCreatePayment}>
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setDisplayCurrentVideoFreePreview(null);
          setShowFreePreviewDialog(false);
        }}
      >
        <DialogContent className="bg-gray-200">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
            <VedioPlayer url={displayCurrentVideoFreePreview} />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetail?.curriculum
              .filter((item) => item?.freePreview)
              .map((curriculumItem, index) => (
                <li
                  onClick={() => handleSetFreePreview(curriculumItem)}
                  className="cursor-pointer list-none flex gap-2 items-center mb-2"
                >
                  <PlayCircle className="w-4 h-4 text-green-600 " />
                  {curriculumItem?.title}
                </li>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseDetailPage;
