import { useEffect, useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux';
import { GET_CURRENT_USER } from '../../graphql/queries';
import { setUser, clearUser } from '../../app/slices/userSlice';
import type { GetCurrentUserQuery, UserType } from '../../graphql/types';
import { useQuery } from '@apollo/client/react';

type AuthInitializerProps = {
    children: ReactNode;
};

const AuthInitializer = ({ children }: AuthInitializerProps) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { data, loading: apolloLoading, error } = useQuery<GetCurrentUserQuery>(GET_CURRENT_USER);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const user: UserType = JSON.parse(storedUser);
                    dispatch(setUser(user));

                    if (!apolloLoading) {
                        if (error || !data?.currentUser) {
                            dispatch(clearUser());
                            localStorage.removeItem('user');
                        } else {
                            dispatch(setUser(data.currentUser));
                        }
                    }
                } catch (error) {
                    console.error('Failed to parse stored user or verify session:', error);
                    dispatch(clearUser());
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [dispatch]);

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    return <>{children}</>;
};

export default AuthInitializer;
