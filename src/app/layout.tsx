import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Event Check-in System',
  description: 'Hệ thống quản lý check-in sự kiện thông minh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
