import { useEffect, useRef, useState } from 'react';
import { Input, Button } from 'antd';
import { socket } from '@/lib/socket';

export default function ChatWindow({ messages, currentUser, recipient }: any) {
    const [text, setText] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollTo({ top: ref.current.scrollHeight });
    }, [messages]);

    const handleSend = () => {
        if (!text || !recipient) return;
        socket.emit('chat_message', {
            to: recipient._id,
            message: text,
        });
        setText('');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="font-bold mb-2">Chat với {recipient?.username}</div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2" ref={ref}>
                {messages.map((msg: any, i: number) => (
                    <div key={i} className={`mb-2 ${msg.from === currentUser._id ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${msg.from === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex gap-2">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="Soạn tin nhắn..."
                />
                <Button onClick={handleSend} type="primary">Gửi</Button>
            </div>
        </div>
    );
}
