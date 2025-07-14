'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import Cookies from 'js-cookie';
import { login } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { user } = await login(values.username, values.password);
            Cookies.set('user', JSON.stringify(user));   // lưu user (token cookie đã do BE set)
            setUser(user);
            router.push('/chat');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            console.log('error', err);
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '90px auto' }}>
            <Typography.Title level={2}>Login</Typography.Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Login
                </Button>
            </Form>
        </div>
    );
}
