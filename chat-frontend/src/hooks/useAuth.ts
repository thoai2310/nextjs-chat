'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export const useAuth = () => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user]);
};
