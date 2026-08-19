import type { ReactNode } from "react";

import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}