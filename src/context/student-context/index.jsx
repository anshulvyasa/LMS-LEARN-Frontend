import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        studentLoading,
        setStudentLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
