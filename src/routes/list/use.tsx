import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Page from '../../components/page';
import { Button } from '../../components/ui/button';
import { useGetListForMVP } from '../../hooks/useGetList';
import CompareSection from '../../pages/session/CompareSection';

export const Route = createFileRoute('/list/use')({
    component: UseList,
});

function UseList() {
    const navigate = useNavigate();
    const { list, isLoading } = useGetListForMVP();

    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (!list) {
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
                <p>List not found :(</p>
            </Page>
        );
    }

    const { name, description } = list;

    return (
        <Page>
            <div className="text-center relative">
                <h1 className="text-4xl font-bold text-gray-900 ">
                    {name || 'Untitled List'}
                </h1>
                <p className="text-lg text-gray-600">{description || ''}</p>
                <CompareSection name={name} items={list.items} />
            </div>
        </Page>
    );
}
