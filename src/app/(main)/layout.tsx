import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Providers } from "@/app/(main)/providers";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Navbar />
      {children}
      <Footer />
    </Providers>
  );
}
