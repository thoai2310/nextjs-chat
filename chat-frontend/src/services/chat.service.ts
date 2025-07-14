import { api } from '@/lib/api';

export const getMessages = async (otherId: string) => {
    const res = await api.get(`/chat/messages/${otherId}`);
    return res.data; // Array<Message>
};
