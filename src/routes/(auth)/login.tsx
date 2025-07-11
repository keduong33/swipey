import { useMutation } from '@tanstack/react-query';
import {
    createFileRoute,
    redirect,
    SearchSchemaInput,
    useRouter,
} from '@tanstack/react-router';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { getBrowserClient } from '../../integrations/supabase/browserClient';
import { AuthForm } from '../../pages/auth/AuthForm';

export const Route = createFileRoute('/(auth)/login')({
    component: Login,
    beforeLoad: ({ context, search }) => {
        if (context.user.isAuthenticated) {
            throw redirect({
                to: search?.redirectUrl || '/',
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
    const { queryClient } = Route.useRouteContext();
    const router = useRouter();
    const search = Route.useSearch();

    const loginMutation = useMutation(
        {
            mutationFn: async ({
                email,
                password,
            }: {
                email: string;
                password: string;
            }) => {
                return await getBrowserClient().auth.signInWithPassword({
                    email,
                    password,
                });
            },
            onSuccess: async (response) => {
                if (!response.error) {
                    await queryClient.invalidateQueries({
                        queryKey: ['user'],
                    });
                    router.navigate({ to: search?.redirectUrl ?? '/' });
                    return;
                }
            },
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
                await loginMutation.mutate({
                    // data: {
                    //     email: username,
                    //     password,
                    //     // redirectUrl: search?.redirectUrl,
                    // },
                    email: username,
                    password,
                });
            }}
            afterSubmit={
                loginMutation.data?.error ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {loginMutation.data.error.message}
                        </AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
}
