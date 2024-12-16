// For now this is the context it is providing the signin data signup data and the function to reset it

import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config"; //we are kind of declaring our variable somewhere else and importing it here to intialsize to state variable
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react"; //importing useState and useContext hook here

export const AuthContext = createContext(null); //creating out the context (AuthContext for Authentication stuff)

//creating a AuthProvider
export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading,setLoading]=useState(true);

  //handling register user
  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
  }

  //handle Login
  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);


    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    console.log(loading);
    
    try{
      const data = await checkAuthService();

    if (data.success) {
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } 
    else {
      setAuth({
        authenticate: false,
        user: null,
      });
       }
    }
    catch(err){
      console.log(err);
      if(!err?.response?.data?.success){
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    }
    setLoading(false)
  }


  //this checkAurhUser() will run once our application is mounted
  useEffect(() => {
    checkAuthUser()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth
      }}
    >
      {
        loading?<Skeleton/>:children
      }
    </AuthContext.Provider>
  );
}
