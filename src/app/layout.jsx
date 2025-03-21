import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { SystemStatusProvider } from '@/context/SystemStatusContext';
import Header from "@/components/Header";
import ChatInterface from "@/components/chatbot/ChatInterface";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "OSI - Chatbot de l'offre de services informatique",
  description: "Assistant conversationnel pour l'offre de services informatique d'Administration Centrale",
  icons: {
    icon: '/osi_favicon.png',
    apple: '/osi_favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <SystemStatusProvider>
              {children}
          </SystemStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
