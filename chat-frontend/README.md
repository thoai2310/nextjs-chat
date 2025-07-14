src/
├─ app/
│  ├─ layout.tsx          # Server layout – bọc <ClientWrapper>
│  ├─ page.tsx            # Trang gốc: redirect tùy token
│  ├─ login/
│  │  └─ page.tsx         # Form đăng nhập
│  └─ chat/
│     └─ page.tsx         # Trang chat (hiển thị ChatLayout)
│
├─ components/
│  ├─ ClientWrapper.tsx   # Client component: bọc UserProvider
│  └─ ChatLayout.tsx      # UI chat (danh sách user, tin nhắn, gửi msg)
│
├─ context/
│  └─ UserContext.tsx     # useUser + UserProvider
│
├─ lib/
│  ├─ api.ts              # Axios (withCredentials)
│  └─ socket.ts           # socket.io‑client
│
├─ services/
│  ├─ auth.service.ts     # login()
│  ├─ user.service.ts     # getUsers()
│  └─ chat.service.ts     # getMessages()
│
├─ styles/
│  └─ globals.css         # Tailwind v4 preflight + utilities
│
└─ middleware.ts          # Chặn truy cập /chat nếu không có cookie token
