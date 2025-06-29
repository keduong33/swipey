import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useGetList } from '~/hooks/useGetList';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import { List } from '../../pages/list/listCard';
import CompareSection from '../../pages/session/CompareSection';

export const Route = createFileRoute('/session/$sessionId')({
    component: Session,
});

function Session() {
    const { sessionId } = Route.useParams();
    const navigate = useNavigate();
    const { lists } = useGetList();
    const retrievedList: List | undefined = lists.get(sessionId);

    if (!retrievedList) {
        return (
            <Page headerConfig={{ sessionId }}>
                <Button
                    size="lg"
                    className="sm:w-auto bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate({ to: '/' })}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go back to Home
                </Button>
                <p>List not found :(</p>
            </Page>
        );
    }

    const { itemCount, name, description } = retrievedList;

    return (
        <Page headerConfig={{ sessionId }}>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {name || 'Untitled List'}
                </h1>
                <p className="text-lg text-gray-600">{description || ''}</p>
                <p className="text-gray-600">({itemCount} items to rank)</p>
            </div>

            <CompareSection items={retrievedList.items} />
        </Page>
    );
}
