import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SessionHelper from '@/utils/session';

export function useAuth(redirectTo = '/') {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const authStatus = SessionHelper.isAuthenticated();
            setIsAuthenticated(authStatus);

            if (!authStatus && redirectTo) {
                router.replace(redirectTo);
            }

            setLoading(false);
        };

        checkAuth();
    }, [router, redirectTo]);

    const logout = async () => {
        await SessionHelper.logout();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        loading,
        user: SessionHelper.getUser(),
        logout
    };
}