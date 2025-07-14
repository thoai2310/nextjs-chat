import { Avatar, List } from 'antd';

export default function UserList({ users, selectedUser, onSelect }: any) {
    return (
        <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(user: any) => (
                <List.Item
                    className={`cursor-pointer hover:bg-gray-100 px-3 py-2 rounded ${
                        selectedUser?._id === user._id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => onSelect(user)}
                >
                    <List.Item.Meta
                        avatar={<Avatar>{user.username[0]}</Avatar>}
                        title={user.username}
                    />
                </List.Item>
            )}
        />
    );
}
