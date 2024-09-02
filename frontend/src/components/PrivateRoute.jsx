import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appPaths } from '../routes';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.app);
  if (!token) {
    return <Navigate to={appPaths.login()} />;
  }
  return children;
};

export default PrivateRoute;
