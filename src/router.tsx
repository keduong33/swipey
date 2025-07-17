import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
import { minuteToMs } from './lib/utils';
import { routeTree } from './routeTree.gen';

export function createRouter() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 0,
                refetchOnWindowFocus: false,
                staleTime: minuteToMs(5),
            },
        },
    });
    const router = routerWithQueryClient(
        createTanStackRouter({
            routeTree,
            scrollRestoration: true,
            defaultSsr: false,
            context: {
                queryClient,
                user: null,
            },

            defaultErrorComponent: DefaultCatchBoundary,
            defaultNotFoundComponent: () => <NotFound />,
        }),
        queryClient
    );

    return router;
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
