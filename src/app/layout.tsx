// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import ThemeRegistry from '@/theme/ThemeRegistry';
import NavBar from '@/components/NavBar'; // We'll define below
import { AuthProvider } from '@/context/AuthProvider';

export const metadata = {
  title: 'ASF - Donations',
  description: 'Collect donations',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
