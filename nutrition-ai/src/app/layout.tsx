import React from 'react';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../lib/auth-context';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NutritionAI - Personalized Diet Plans',
  description: 'Generate personalized diet plans based on your body metrics, preferences, and health goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}