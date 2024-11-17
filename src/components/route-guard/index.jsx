import { Fragment } from "react";
import { useLocation,Navigate } from "react-router-dom";

function RouteGaurd({ authenticated, user, element }) {
  const location = useLocation();
 console.log(authenticated)
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (
    (authenticated &&
      user.role != "instructor" &&
      location.pathname.includes("instructor")) ||
    location.pathname.includes("/auth")
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    user.role === "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGaurd;
