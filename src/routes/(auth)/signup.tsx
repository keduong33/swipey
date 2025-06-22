import {
    createFileRoute,
    redirect,
    SearchSchemaInput,
} from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useMutation } from '../../hooks/useMutation';
import { AuthForm } from '../../pages/auth/AuthForm';
import { signupFunction } from '../../pages/auth/signup/signup_service';

export const Route = createFileRoute('/(auth)/signup')({
    component: Signup,
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
                redirectUrl,
            };
    },
});

export default function Signup() {
    const search = Route.useSearch();
    const signupMutation = useMutation({
        fn: useServerFn(signupFunction),
    });

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
                        redirectUrl: search?.redirectUrl,
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
