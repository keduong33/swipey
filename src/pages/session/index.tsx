import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Router from 'next/router';
import { FormEvent } from 'react';

const formSessionCode = 'session-code';

function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const sessionCode = formData.get(formSessionCode) as string;
    Router.push(`/session/${sessionCode}`);
}

export default function JoinSession() {
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
