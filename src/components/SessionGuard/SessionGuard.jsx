import { Navigate } from "react-router-dom";

function SessionGuard({ element }) {
  const isUserLoggedIn = localStorage.getItem("UserLogged");

  if (isUserLoggedIn) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

export default SessionGuard;
