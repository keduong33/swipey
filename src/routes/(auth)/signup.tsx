import { useMutation } from '@tanstack/react-query';
import {
    createFileRoute,
    redirect,
    SearchSchemaInput,
    useRouter,
} from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AuthForm } from '../../pages/auth/AuthForm';
import { signupFunction } from '../../pages/auth/signup/signup_service';

export const Route = createFileRoute('/(auth)/signup')({
    component: Signup,
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
                redirectUrl,
            };
    },
});

export default function Signup() {
    const { queryClient } = Route.useRouteContext();
    const search = Route.useSearch();
    const signup = useServerFn(signupFunction);
    const router = useRouter();

    const signupMutation = useMutation(
        {
            mutationFn: signup,
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
            redirectUrl={search?.redirectUrl}
            actionText="Sign Up"
            status={signupMutation.status}
            onSubmit={async ({ username, password }) => {
                await signupMutation.mutate({
                    data: {
                        email: username,
                        password,
                    },
                });
            }}
            afterSubmit={
                signupMutation.data?.error ? (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            {signupMutation.data.message}
                        </AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
}
