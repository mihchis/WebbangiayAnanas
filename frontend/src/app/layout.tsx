import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/providers/query-provider";
import Header from "../components/Header";
import Footer from "../components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ananas - Discover You | Cửa Hàng Giày Ananas Chính Hãng",
  description: "Mua sắm giày Ananas nam nữ chính hãng với các dòng sản phẩm Vintas, Track 6, Urbas cực chất, chất lượng và thời thượng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 font-sans">
        <QueryProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

