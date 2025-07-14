import { api } from '@/lib/api';

export const getUsers = async () => {
    const res = await api.get('/users/list');
    return res.data; // Array<User>
};
