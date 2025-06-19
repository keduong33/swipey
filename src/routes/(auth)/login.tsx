import {
    createFileRoute,
    redirect,
    SearchSchemaInput,
    useRouter,
} from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useMutation } from '../../hooks/useMutation';
import { AuthForm } from '../../pages/auth/AuthForm';
import { loginFunction } from '../../pages/auth/login/login_server_functions';

export const Route = createFileRoute('/(auth)/login')({
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.user) {
            throw redirect({
                to: '/',
            });
        }
    },
    validateSearch: ({
        redirectUrl,
    }: { redirectUrl?: string } & SearchSchemaInput) => {
        if (redirectUrl)
            return {
                redirectUrl: redirectUrl,
            };
    },
});

export function Login() {
    const router = useRouter();
    const search = Route.useSearch();

    const loginMutation = useMutation({
        fn: useServerFn(loginFunction),
    });

    return (
        <AuthForm
            isLogin
            redirectUrl={search?.redirectUrl}
            actionText="Login"
            status={loginMutation.status}
            onSubmit={async ({ username, password }) => {
                await loginMutation.mutate({
                    data: {
                        email: username,
                        password,
                        redirectUrl: search?.redirectUrl,
                    },
                });
            }}
            afterSubmit={
                loginMutation.data?.error ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {loginMutation.data.message}
                        </AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
}
