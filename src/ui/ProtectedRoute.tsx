import { selectCurrentUser } from '@/features/auth/authSlice';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	const user = useSelector(selectCurrentUser);

	useEffect(() => {
		if (!user || !(user?.role === 'authenticated' || !user.id)) {
			navigate('/login');
		}
	}, [user, navigate]);

	if (!user) return;

	return children;
};
export default ProtectedRoute;
