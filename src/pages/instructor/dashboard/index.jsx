import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context/Index";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashBoardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredential } = useContext(AuthContext);
  const { instructorCourseInitialList, setInstructorCourseInitialList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    console.log(response);
    if (response?.success) setInstructorCourseInitialList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuOption = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: (
        <InstructorDashboard listOfCourses={instructorCourseInitialList} />
      ),
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: (
        <InstructorCourses listOfCourses={instructorCourseInitialList} />
      ),
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    sessionStorage.clear();
    resetCredential();
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuOption.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab == menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto ">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 ">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuOption.map((menuItem) => (
              <TabsContent value={menuItem.value}>
                {menuItem.component != null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
export default InstructorDashBoardPage;
