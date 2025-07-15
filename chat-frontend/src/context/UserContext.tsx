'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import {usePathname} from "next/navigation";

type User = { _id: string; username: string } | null;
type Ctx = { user: User; setUser: (u: User) => void };
const PUBLIC_ROUTES = ['/login', '/register'];

const UserContext = createContext<Ctx | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (user || PUBLIC_ROUTES.includes(pathname)) {
            return;
        }
        const cookieUser = Cookies.get('user');
        if (cookieUser) {
            setUser(JSON.parse(cookieUser));
            return;
        }
        api
            .get('/auth/me')
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, [pathname, user]);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
};
