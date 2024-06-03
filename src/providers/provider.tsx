'use client';
import React from 'react';
import QueryclientProvider from './QueryClientProvider';
import ToastProvider from './toastProvider';
import AuthProvider from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
function Provider({ children }: any) {
  return (
    <AuthProvider>
      <QueryclientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryclientProvider>
    </AuthProvider>
  );
}

export default Provider;
