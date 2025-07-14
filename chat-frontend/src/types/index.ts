export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string;
}