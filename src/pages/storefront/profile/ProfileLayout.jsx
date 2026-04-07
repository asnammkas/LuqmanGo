import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfileLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
