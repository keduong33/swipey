// src/client.tsx
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { createRouter } from './router';

const router = createRouter();

function InnerApp() {
    const user = useAuth();
    return <RouterProvider router={router} context={{ user }} />;
}

function App() {
    return (
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    );
}

hydrateRoot(
    document,
    <StrictMode>
        <App />
    </StrictMode>
);
