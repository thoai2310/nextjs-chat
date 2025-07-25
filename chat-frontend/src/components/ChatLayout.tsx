'use client';

import { useEffect, useState, useRef } from 'react';
import { Layout, List, Input, Button, Space } from 'antd';
import { getUsers } from '@/services/user.service';
import { getMessages } from '@/services/chat.service';
import { socket } from '@/lib/socket';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ChatUser, ChatMessage } from "@/types";
import {api} from "@/lib/api";

const { Sider, Content } = Layout;

export default function ChatLayout() {
    const { user } = useUser();

    const [users, setUsers] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // auto‑scroll
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages]);

    // socket connect
    useEffect(() => {
        if (!user) return;
        socket.connect();

        socket.on('chat_message', (msg) => {
            const isRelevant =
                (msg.from === user._id && msg.to === selectedUser?._id) ||
                (msg.to === user._id && msg.from === selectedUser?._id);
            if (isRelevant) setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('chat_message');
            socket.disconnect();
        };
    }, [user, selectedUser]);

    // fetch users once
    useEffect(() => {
        getUsers().then(setUsers);
    }, []);

    // fetch messages when selecting user
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id).then(setMessages);
        }
    }, [selectedUser]);

    const send = () => {
        if (!message.trim() || !selectedUser) return;
        socket.emit('chat_message', { to: selectedUser._id, message });
        setMessage('');
    };
    
    const logout = async () => {
        try {
            await api.get('auth/logout');
        } catch (e) {
            console.error(e);

        } finally {
            socket.disconnect();
            Cookies.remove('token');
            Cookies.remove('user');
            router.push('/login');
        }

      Cookies.remove('token');
      Cookies.remove('user');
      router.push('/login');
    }

    if (!user) return <div style={{ padding: 32 }}>Loading...</div>;

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={220} style={{ background: '#fff', padding: 16, display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <List
                        header={<b>Users</b>}
                        dataSource={users.filter((u) => u._id !== user._id)}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => setSelectedUser(item)}
                                style={{
                                    cursor: 'pointer',
                                    background: selectedUser?._id === item._id ? '#e6f7ff' : undefined,
                                }}
                            >
                                {item.username}
                            </List.Item>
                        )}
                    />
                </div>

                <Button type="primary" danger onClick={logout} style={{ marginTop: 16 }}>
                    Logout
                </Button>
            </Sider>

            <Content style={{ display: 'flex', flexDirection: 'column', padding: 16 }}>
                {selectedUser ? (
                    <>
                        <div style={{ flex: 1, overflowY: 'auto' }} ref={scrollRef}>
                            {messages.map((m) => {
                                const isMine = m.from === user._id;
                                return (
                                    <div key={m._id} style={{ textAlign: isMine ? 'right' : 'left', marginBottom: 8 }}>
                                        <b>{isMine ? 'You' : selectedUser.username}</b>: {m.message}
                                    </div>
                                );
                            })}
                        </div>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onPressEnter={send}
                            />
                            <Button type="primary" onClick={send}>
                                Send
                            </Button>
                        </Space.Compact>
                    </>
                ) : (
                    <div>Select a user to start chatting</div>
                )}
            </Content>
        </Layout>
    );
}
