import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context/Index";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import VedioPlayer from "@/components/vedio-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const StudentViewProgressPage = () => {
  const { studentCurrentCourseProgress, setCurrentStudentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();
  const { id } = useParams();

  async function handleRewatch() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);

      getCurrentCourseProgress();
    }
  }

  async function getCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user._id, id);
    // console.log("response   :  ", response);

    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setCurrentStudentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
          completed: true,
        });
      }
    }

    if (response?.data?.completed) {
      setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
      setShowCourseCompleteDialog(true);
      setShowConfetti(true);
      return;
    }

    if (response?.data?.progress == 0) {
      setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
    } else {
      console.log("Logging Here   ");
      const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
        (acc, obj, index) => {
          return acc == -1 && obj.viewed ? index : acc;
        },
        -1
      );

      setCurrentLecture(
        response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1]
      );
    }
  }
  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id
      );

      if (response?.success) {
        getCurrentCourseProgress();
      }
    }
  }

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture]);

  useEffect(() => {
    getCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [showConfetti]);

  console.log("Current Lecture : ", currentLecture);
  // console.log(
  //   "Student Current Course Progress : ",
  //   studentCurrentCourseProgress
  // );

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1c1d1f]  text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4 ">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-white  "
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back To My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block ">
            {/* {studentCurrentCourseProgress?.courseDetails.title} */}
          </h1>
        </div>
        <Button
          onClick={() => {
            setIsSideBarOpen(!isSideBarOpen);
          }}
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300 `}
        >
          {currentLecture && (
            <VedioPlayer
              width="100%"
              height="500px"
              url={currentLecture.vedioUrl}
              onProgressUpdate={setCurrentLecture}
              progresData={currentLecture}
            />
          )}
          <div className="p-6 bg-[#1c1d1f] ">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`fixed top-[67px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className="rounded-none h-full flex items-center justify-center"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="rounded-none h-full flex items-center justify-center"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea>
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span>{item.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 ">
                  <h2 className="text-xl font-bold mb-4">About This Course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={lockCourse}>
        <DialogContent className="w-[425px]">
          <DialogHeader>
            <DialogTitle>You Can't view this page</DialogTitle>
            <DialogDescription>
              Please Purchase this Course To access it.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="w-[425px]">
          <DialogHeader>
            <DialogTitle>Congrats you have completed the Course</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You Have Completed The Course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={() => handleRewatch()}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewProgressPage;
