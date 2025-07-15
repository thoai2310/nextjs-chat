'use client';

import { useRouter } from 'next/navigation';
import { register } from '@/services/auth.service';
import {Form, Typography, Input, Button, notification } from "antd";
import { RegisterFormValues } from "@/types";

export default function RegisterPage() {
    const router = useRouter();

    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            const result = await register(values.username, values.password);
            console.log('result', result);
            router.push('/login');
        } catch (err) {
            console.log('err', err);
            showNotificationError('Failed to register');
            alert('Failed to register');
        }
    };

    const showNotificationError = (content: string) => {
        notification.error({
            message: 'Error',
            description: content,
            placement: 'topRight'
        })
    }

    return (
        <div style={{maxWidth: 400, margin: '90px auto'}}>
            <Typography.Title level={2}>Register</Typography.Title>
            <Form layout={'vertical'} onFinish={handleSubmit}>
                <Form.Item label={'Username'} name={'username'} rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item label={'Password'} name={'password'} rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Button type='primary' htmlType={'submit'}>Register</Button>
            </Form>
        </div>
    );
}