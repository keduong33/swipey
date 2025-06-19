import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { Button } from '../../components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';

const AuthFormSchema = z.object({
    username: z.email(),
    password: z.string(),
});

export type UserAuth = z.infer<typeof AuthFormSchema>;

export function AuthForm({
    actionText,
    onSubmit,
    status,
    isLogin = false,
    redirectUrl,
    afterSubmit,
}: {
    actionText: string;
    onSubmit: (input: UserAuth) => void;
    status: 'pending' | 'idle' | 'success' | 'error';
    isLogin?: boolean;
    redirectUrl?: string;
    afterSubmit?: React.ReactNode;
}) {
    const form = useForm<UserAuth>({
        resolver: zodResolver(AuthFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { username, password } = form.watch();

    const disabledSubmit = useMemo(() => {
        return !username || !password || status === 'pending';
    }, [username, password, status]);

    return (
        <div className="fixed inset-0 flex items-start justify-center p-8">
            <div className="md:w-md p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">{actionText}</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    {!isLogin && (
                                        <FormDescription>
                                            This will be your username.
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={disabledSubmit}>
                                {status === 'pending' ? '...' : actionText}
                            </Button>
                            <OtherAuthOption
                                isLogin={isLogin}
                                redirectUrl={redirectUrl}
                            />
                            {afterSubmit ? afterSubmit : null}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

function OtherAuthOption({
    isLogin,
    redirectUrl,
}: {
    isLogin: boolean;
    redirectUrl?: string;
}) {
    return (
        <>
            {isLogin && (
                <Button asChild variant="link">
                    <Link to="/signup" search={{ redirectUrl }}>
                        Sign up
                    </Link>
                </Button>
            )}
            {!isLogin && (
                <Button asChild variant="link">
                    <Link
                        to="/login"
                        search={{
                            redirectUrl,
                        }}
                    >
                        Login
                    </Link>
                </Button>
            )}
        </>
    );
}
