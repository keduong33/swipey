import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
    beforeLoad: ({ context, location }) => {
        if (!context.user.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirectUrl: location.href,
                },
            });
        }
    },
});
