import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { UserProvider } from '../context/UserContext';

export const metadata: Metadata = {
  title: 'Wayfarer — Honest Ratings, Fair Bookings',
  description:
    'A premium travel discovery and tour booking platform for Addis Ababa, Ethiopia. Powered by Bayesian rating honesty and concurrency-safe seat reservations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#252A27] font-sans antialiased selection:bg-[#163D32] selection:text-white">
        <UserProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
