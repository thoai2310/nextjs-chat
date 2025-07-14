'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

type User = { _id: string; username: string } | null;
type Ctx = { user: User; setUser: (u: User) => void };

const UserContext = createContext<Ctx | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    // Nếu BE đã set cookie token ⇒ gọi /auth/me để lấy user
    useEffect(() => {
        const cookieUser = Cookies.get('user');
        if (cookieUser) {
            setUser(JSON.parse(cookieUser));
            return;
        }
        api
            .get('/auth/me')
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
};
