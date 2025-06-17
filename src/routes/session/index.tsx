import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';

export const Route = createFileRoute('/session/')({
    component: JoinSession,
});

const formSessionCode = 'session-code';

function JoinSession() {
    const navigate = useNavigate();

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const sessionCode = formData.get(formSessionCode) as string;
        navigate({ to: `/session/${sessionCode}` });
    }

    return (
        <form onSubmit={onSubmit}>
            <section className="flex w-full min-h-screen items-center justify-center">
                <Card className="w-full max-w-sm m-4">
                    <CardHeader className="justify-center">
                        <CardTitle>Enter session code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="Session Code"
                            className="text-center"
                            name={formSessionCode}
                        ></Input>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Join
                        </Button>
                    </CardFooter>
                </Card>
            </section>
        </form>
    );
}
