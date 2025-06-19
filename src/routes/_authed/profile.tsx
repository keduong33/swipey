import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { useMutation } from '../../hooks/useMutation';
import { ProfileMessages } from '../../pages/profile/profile.messages';
import { logoutFunction } from '../../pages/profile/profile_server_functions';

export const Route = createFileRoute('/_authed/profile')({
    component: Profile,
    loader: ({ context }) => {
        return context.user;
    },
});

function Profile() {
    const user = Route.useLoaderData();
    const logoutMutation = useMutation({
        fn: useServerFn(logoutFunction),
    });

    return (
        <>
            <>Hello {user?.email}</>
            <Button onClick={() => logoutMutation.mutate({})}>
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
