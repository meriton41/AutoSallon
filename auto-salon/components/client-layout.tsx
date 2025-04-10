'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/verify-email", "/verify-email/notice"];
  const shouldHide = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHide && <Header />}
      <main className="flex-1">{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
}
