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

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface RegisterFormValues {
    username: string;
    password: string;
}

export interface ChatUser {
    _id: string;
    username: string;
}

export interface ChatMessage {
    _id: string;
    from: string;
    to: string;
    message: string;
    createdAt: string;
}