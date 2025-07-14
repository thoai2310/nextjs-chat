'use client';

import { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { login } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await login(values.username, values.password);
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            setUser(res.user);
            router.push('/chat');
        } catch (err) {
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
            <Typography.Title level={2}>Login</Typography.Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    Login
                </Button>
            </Form>
        </div>
    );
}
