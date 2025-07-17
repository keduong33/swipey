import { useMutation } from '@tanstack/react-query';
import {
    createFileRoute,
    redirect,
    SearchSchemaInput,
} from '@tanstack/react-router';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AuthForm } from '../../pages/auth/AuthForm';
import { login } from '../../pages/auth/login.api';

export const Route = createFileRoute('/(auth)/login')({
    component: Login,
    beforeLoad: ({ context, search }) => {
        if (context.user?.isAuthenticated) {
            throw redirect({
                to: search?.redirectUrl || '/',
            });
        }
    },
    validateSearch: ({
        redirectUrl,
    }: { redirectUrl?: string } & SearchSchemaInput) => {
        return {
            redirectUrl,
        };
    },
});

export function Login() {
    const { queryClient } = Route.useRouteContext();
    const search = Route.useSearch();

    const loginMutation = useMutation(
        {
            mutationFn: login,
        },
        queryClient
    );

    return (
        <AuthForm
            isLogin
            redirectUrl={search?.redirectUrl}
            actionText="Login"
            status={loginMutation.status}
            onSubmit={async ({ username, password }) => {
                loginMutation.mutate({
                    email: username,
                    password,
                    redirectUrl: search?.redirectUrl,
                });
            }}
            afterSubmit={
                loginMutation.error ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {loginMutation.error.message}
                        </AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
}
