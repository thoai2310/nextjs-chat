import '@/styles/globals.css';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata = {
    title: 'Chat App',
    description: 'Realtime chat using Next.js & NestJS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ClientWrapper>{children}</ClientWrapper>
        </body>
        </html>
    );
}
