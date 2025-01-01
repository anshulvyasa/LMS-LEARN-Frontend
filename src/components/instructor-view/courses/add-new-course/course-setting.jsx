import MediaProgressBar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );

        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          console.log(courseLandingFormData);
        }

        setMediaUploadProgress(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Setting</CardTitle>
      </CardHeader>
      <CardContent>
        {mediaUploadProgress && (
          <MediaProgressBar
            progress={mediaUploadProgressPercentage}
            isMediaUploading={mediaUploadProgress}
          />
        )}
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} className="rounded-lg" />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
