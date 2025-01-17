import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, User } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentAndProfit() {
    if (listOfCourses) {
      const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
        (acc, course) => {
          const studentCount = course.Student.length;
          acc.totalStudents += studentCount;
          acc.totalProfit += studentCount * course.pricing;

          course.Student.forEach((student) => {
            acc.studentList.push({
              courseTitle: course.title,
              studentName: student.studentName,
              studentEmail: student.studentEmail,
            });
          });

          return acc;
        },
        {
          totalStudents: 0,
          totalProfit: 0,
          studentList: [],
        }
      );

      return {
        totalStudents,
        totalProfit,
        studentList,
      };
    }
  }

  const dashboardData = calculateTotalStudentAndProfit();

  const config = [
    {
      icon: User,
      label: "Total Students",
      value: dashboardData.totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: dashboardData.totalProfit,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.studentList.map((student) => (
                  <TableRow>
                    <TableCell>{student.courseTitle}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.studentEmail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default InstructorDashboard;
