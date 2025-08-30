import { useMutation } from '@tanstack/react-query';
import {
    createFileRoute,
    notFound,
    SearchSchemaInput,
} from '@tanstack/react-router';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AuthForm } from '../../pages/auth/AuthForm';
import { signUp } from '../../pages/auth/signup/signup.api';

export const Route = createFileRoute('/(auth)/signup')({
    component: Signup,
    beforeLoad: ({ context, search }) => {
        // Remove notfound if want to enable login
        throw notFound();
        // if (context.user?.isAuthenticated) {
        //     throw redirect({
        //         to: search?.redirectUrl || '/',
        //     });
        // }
    },
    validateSearch: ({
        redirectUrl,
    }: { redirectUrl?: string } & SearchSchemaInput) => {
        return {
            redirectUrl,
        };
    },
});

export default function Signup() {
    const { queryClient } = Route.useRouteContext();
    const search = Route.useSearch();
    const { redirectUrl } = Route.useSearch();

    const signupMutation = useMutation(
        {
            mutationFn: signUp,
        },
        queryClient
    );

    return (
        <AuthForm
            redirectUrl={search?.redirectUrl}
            actionText="Sign Up"
            status={signupMutation.status}
            onSubmit={({ username, password }) => {
                signupMutation.mutate({
                    email: username,
                    password,
                    redirectUrl,
                });
            }}
            afterSubmit={
                signupMutation.error ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {signupMutation.error.message}
                        </AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
}
