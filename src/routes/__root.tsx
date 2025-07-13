/// <reference types="vite/client" />
import { QueryClient } from '@tanstack/react-query';
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRouteWithContext,
} from '@tanstack/react-router';
import * as React from 'react';
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary';
import { NotFound } from '../components/NotFound';
import { ThemeProvider } from '../components/ThemeProvider';
import { getUser } from '../lib/auth';
import { seo } from '../lib/seo';
import { User } from '../pages/auth/auth.queries';
import globalCss from '../styles/global.css?url';

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    user: User;
}>()({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            ...seo({
                title: 'Swipey',
                description: `Swipe to rank your favourite things.`,
            }),
        ],
        links: [
            { rel: 'stylesheet', href: globalCss },
            {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                href: '/apple-touch-icon.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicon-32x32.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicon-16x16.png',
            },
            // { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
            { rel: 'icon', href: '/favicon.svg' },
        ],
    }),
    async beforeLoad() {
        const user = await getUser();
        return {
            user,
        };
    },
    errorComponent: (props) => {
        return (
            <RootDocument>
                <DefaultCatchBoundary {...props} />
            </RootDocument>
        );
    },
    notFoundComponent: () => <NotFound />,
    shellComponent: RootComponent,
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider>{children}</ThemeProvider>
                {/* <TanStackRouterDevtools position="bottom-right" /> */}
                <Scripts />
            </body>
        </html>
    );
}
