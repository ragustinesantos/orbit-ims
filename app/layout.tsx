'use client';

import '@mantine/core/styles.css';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { AuthContextProvider } from './_utils/auth-context';
import { InventoryContextProvider } from './_utils/inventory-context';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/assets/logo/orbit_logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
          <MantineProvider theme={theme}>
            <AuthContextProvider>
              <InventoryContextProvider>{children}</InventoryContextProvider>
            </AuthContextProvider>
          </MantineProvider>
      </body>
    </html>
  );
}
