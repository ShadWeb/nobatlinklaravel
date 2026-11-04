import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "نوبت‌لینک | صفحه رزرو اختصاصی شما",
  description:
    "رزرو ساده و آنلاین نوبت؛ صفحه اختصاصی کسب‌وکار شما با نوبت‌لینک.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
