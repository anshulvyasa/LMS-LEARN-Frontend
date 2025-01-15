import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context/Index";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentBoughtCoursesStatus,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export const StudentViewCoursesPage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filter, setFilter] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    studentLoading,
    setStudentLoading,
  } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);

  function handleCheckChange(getSectionId, getCurrentOption) {
    let cpyFilter = { ...filter };
    const indexOfCurrentSection = Object.keys(cpyFilter).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilter = {
        ...cpyFilter,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      let indexOfCurrentOption =
        cpyFilter[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilter[getSectionId].push(getCurrentOption);
      else cpyFilter[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilter(cpyFilter);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilter));
  }

  async function getStudentViewCourseList(filter, sort) {
    const query = new URLSearchParams({
      ...filter,
      sortby: sort,
    });

    setStudentLoading(true);
    const response = await fetchStudentViewCourseListService(query);

    if (response?.success) {
      setStudentViewCoursesList(response.data);
    }
    setStudentLoading(false);
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

  async function handleCourseClick(courseId) {
    const response = await fetchStudentBoughtCoursesStatus(
      courseId,
      auth?.user._id
    );

    console.log("Message from fetchCurseStatus  ", response);

    if (response?.status) {
      navigate(`/course-progress/${courseId}`);
    } else {
      navigate(`/courses/details/${courseId}`);
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filter);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filter]);

  useEffect(() => {
    if (filter != null && sort != null) getStudentViewCourseList(filter, sort);
  }, [filter, sort]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilter(JSON.parse(sessionStorage.getItem("filters")) || {});

    return () => sessionStorage.removeItem("filters");
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <div className="p-4 space-y-4">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label className="flex font-medium items-center gap-3">
                      <Checkbox
                        checked={
                          filter &&
                          Object.keys(filter).length > 0 &&
                          filter[keyItem] &&
                          filter[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleCheckChange(keyItem, option.id)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-5 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-4"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className=" text-[16px] font-medium">Sort By </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-50 ">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} className="mr-3">
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-900 font-bold">
              {studentViewCoursesList.length} results
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseClick(courseItem?._id)}
                  className="cursor-pointer"
                  key={courseItem?._id}
                >
                  <CardContent className="flex p-4 gap-4">
                    <div className="w-48 h-32 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        src={courseItem?.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mb-2 mt-2">
                        {`${courseItem?.curriculum?.length}  ${
                          courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } -
                           ${courseItem?.level} Level
                        `}
                      </p>
                      <p className="font-bold text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : studentLoading ? (
              <Skeleton />
            ) : (
              <h1>No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
