'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UserProvider } from '@/context/UserContext';

export default function ClientWrapper({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Chỉ cho render sau khi client mount để tránh hydration error
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <UserProvider>{children}</UserProvider>;
}
