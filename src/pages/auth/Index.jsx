// This is FrontEnd Authentication Page

import CommonForm from "@/components/common-form-component"; //Importing CommonForm file from  component/common-form-component you will find out description there
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInController, signUpFormControl } from "@/config"; //importing controller from our config file
import { AuthContext } from "@/context/auth-context/Index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"; //importing shadcn Tab UI
import { GraduationCap } from "lucide-react"; //just a Icon from luclied-react
import { useContext, useState } from "react"; //importing react use state Hook
import { Link } from "react-router-dom"; //Importing Link for Navigation Purpose

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin"); //creating a state variable to decide whether i am on signin tab or signup tab (default state is signin )

  //getting Value from Context
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser
  } = useContext(AuthContext);

  function handleTabChange(value) {
    //function that is switching state between signin and signup state
    setActiveTab(value);
  }

  //this function check if the signIn form is Valid or Not
  function checkSignInDataIsValid() {
    return (
      signInFormData && 
      signInFormData.userEmail!='' && 
      signInFormData.password!=''
    );
  }

  //this function check if SignUp form is valid or Not
  function checkSignUpDataIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName != "" &&
      signUpFormData.userEmail != "" &&
      signUpFormData.password != ""
    );
  }

  //render Logic here

  return (
    <div className="flex flex-col min-h-screen ">
      {/* header component that contain logo stuff */}
      <header className="px-4 lg:px-6 h-14  flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </header>
      {/* Tabs render here i.e signin and sign up  */}
      <div className="flex items-center justify-center min-h-screen ">
        {/* Shadcn UI Icon Tab */}
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md "
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="signin"
              className={`py-2 text-lg font-semibold ${
                activeTab === "signin" ? "bg-gray-200 rounded-sm" : ""
              }`}
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className={`py-2 text-lg font-semibold ${
                activeTab === "signup" ? "bg-gray-200 rounded-sm" : ""
              }`}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-3" value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign in to your Account</CardTitle>{" "}
                <CardDescription>
                  Enter your email and password to acces your account{" "}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControl={signInController}
                  buttonText="Sign In"
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isDisabled={!checkSignInDataIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent className="mt-3" value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create new Account</CardTitle>{" "}
                <CardDescription>
                  Enter your details to get Started{" "}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControl={signUpFormControl}
                  buttonText="Sign Up"
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isDisabled={!checkSignUpDataIsValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>{" "}
      {/*tab logic ends here */}
    </div>
  );
};

export default Auth;
