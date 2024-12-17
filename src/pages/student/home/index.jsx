import { AuthContext } from "@/context/auth-context/Index";
import { useContext } from "react";


function  StudentHomePage() {
  const {resetCredential}=useContext(AuthContext);

  function handleLogout() {
    sessionStorage.clear();
    resetCredential();
   }
  return (
    <div>
      <button onClick={handleLogout}>LogOut</button>
    </div>
  )
}

export default StudentHomePage
