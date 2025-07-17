import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { logout } from '../../pages/auth/logout.api';
import { ProfileMessages } from '../../pages/profile/profile.messages';

export const Route = createFileRoute('/_authed/profile')({
    component: Profile,
    loader: ({ context: { user } }) => {
        return user;
    },
});

function Profile() {
    const user = Route.useLoaderData();
    const { queryClient } = Route.useRouteContext();

    const logoutMutation = useMutation(
        {
            mutationFn: logout,
        },
        queryClient
    );

    return (
        <>
            {/* <>Hello {user?.email}</> */}
            <Button onClick={() => logoutMutation.mutate()}>
                {ProfileMessages.LogOutButton()}
            </Button>
            {logoutMutation.error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {logoutMutation.error?.message}
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
}
