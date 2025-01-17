import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentViewCourseDetail, setStudentViewCourseDetail] = useState(null);
  const [currentCourseDetailId, setCurrentCourseDetailId] = useState(null);
  const [studentBoughtList, setStudentBoughtList] = useState([]);
  const [studentCurrentCourseProgress, setCurrentStudentCourseProgress] =
    useState({});

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        studentLoading,
        setStudentLoading,
        studentViewCourseDetail,
        setStudentViewCourseDetail,
        currentCourseDetailId,
        setCurrentCourseDetailId,
        studentBoughtList,
        setStudentBoughtList,
        studentCurrentCourseProgress,
        setCurrentStudentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
