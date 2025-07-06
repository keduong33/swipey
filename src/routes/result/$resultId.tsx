import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Page from '../../components/Page';
import { Button } from '../../components/ui/button';

import { useLocalGetResult } from '../../hooks/useGetResult';
import ResultsSection from '../../pages/session/ResultsSection';

export const Route = createFileRoute('/result/$resultId')({
    component: RouteComponent,
});

function RouteComponent() {
    const { resultId } = Route.useParams();
    const navigate = useNavigate();

    const { result, isLoading } = useLocalGetResult(resultId);

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (!result) {
        return (
            <Page>
                <Button
                    size="lg"
                    className="sm:w-auto hover:bg-accent-darker dark:hover:bg-accent-darker"
                    onClick={() => navigate({ to: '/' })}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go back to Home
                </Button>
                <p>Results not found :(</p>
            </Page>
        );
    }

    return (
        <Page>
            <ResultsSection result={result} />
        </Page>
    );
}
