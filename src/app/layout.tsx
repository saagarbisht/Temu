import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCurrentSession } from "@/actions/auth";
import { Toaster } from 'sonner';
import { SanityLive } from "@/sanity/lib/live";
import HeaderCategorySelectory from "@/components/layout/HeaderCategorySelectory";
import Cart from "@/components/cart/Cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temu",
  description: "Temu clone using latest Nextjs 15 and React 19",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const {user} = await getCurrentSession();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header user={user} categorySelector={<HeaderCategorySelectory/>}/>
        <main>{children}</main>
        <Footer />
        <Cart/>
        <SanityLive/>
        <Toaster position="top-center"  expand={false} richColors/>
      </body>
    </html>
  );
}
