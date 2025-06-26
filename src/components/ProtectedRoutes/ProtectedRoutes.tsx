import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRoutesProps {
  canActivate: boolean;
  redirectPath?: string;
}

const ProtectedRoutes = ({canActivate, redirectPath = "/"}: ProtectedRoutesProps) => {
  if (!canActivate) {
    return <Navigate to={redirectPath} replace />
  }
  return <Outlet />
}

export default ProtectedRoutes;