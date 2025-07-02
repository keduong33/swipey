import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Page from '~/components/page';
import { Button } from '~/components/ui/button';
import { useGetResult } from '~/hooks/useGetResult';
import ResultsSection from '~/pages/session/ResultsSection';

export const Route = createFileRoute('/list/result')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();

    const { result, isLoading } = useGetResult();

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (!result) {
        return (
            <Page>
                <Button
                    size="lg"
                    className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate({ to: '/' })}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go back to Home
                </Button>
                <p>Results not found :(</p>
                <Button onClick={() => navigate({ to: '/list/use' })}>
                    Rank saved list
                </Button>
            </Page>
        );
    }

    if (result) {
        const { name, comparisions, currentArray } = result;

        return (
            <Page>
                <ResultsSection
                    name={name}
                    currentArray={currentArray}
                    comparisions={comparisions}
                />
            </Page>
        );
    }
}
