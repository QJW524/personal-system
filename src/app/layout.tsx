import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '邱继伟靓仔的个人系统 ',
  description: '一个聚焦真实项目与长期记录的个人网站。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN'>
      <body>{children}</body>
    </html>
  );
}
