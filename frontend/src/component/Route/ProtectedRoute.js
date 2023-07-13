import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate} from "react-router-dom";

const ProtectedRoute =({ isAdmin,children})=>{
  const {isAuthenticated,loading ,user}=useSelector(state=>state.user)
  if(loading ===false ){
  if(isAuthenticated===false ){
    return <Navigate to={"/login"} />
  }
  if (isAdmin === true && user.role !== "admin") {
    return <Navigate to={"/login"} />
  }
  return children;
}
}


export default ProtectedRoute;
