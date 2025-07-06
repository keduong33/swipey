import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Page from '../../../components/Pagee';
import { Button } from '../../../components/ui/button';
import { useLocalGetList } from '../../../hooks/useGetList';
import CompareSection from '../../../pages/session/CompareSection';

export const Route = createFileRoute('/list/use/$listId')({
    component: UseList,
});

function UseList() {
    const { listId } = Route.useParams();
    const navigate = useNavigate();
    const { list, isLoading } = useLocalGetList(listId);

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (!list) {
        return (
            <Page>
                <Button
                    size="lg"
                    className="sm:w-auto  dark:hover:bg-accent-darker"
                    onClick={() => navigate({ to: '/' })}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go back to Home
                </Button>
                <p>List not found :(</p>
            </Page>
        );
    }

    return (
        <Page>
            <div className="text-center relative">
                <CompareSection list={list} />
            </div>
        </Page>
    );
}
