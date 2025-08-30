import { createFileRoute, redirect } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { EditList } from '../../../pages/list/edit/EditList';
import { getListWithItemsOptions } from '../../../pages/list/list.queries';

export const Route = createFileRoute('/list/edit/$listId')({
    component: RouteComponent,
    loader: ({ context: { queryClient }, params: { listId } }) =>
        queryClient.ensureQueryData(getListWithItemsOptions(listId)),
    pendingComponent: () => <Loader2 className="animate-spin" />,
    onError: (error) => {
        if (error instanceof Error) alert(error.message);
        else {
            alert('Something is wrong');
            console.error(error);
        }
        redirect({ to: '/' });
    },
});

function RouteComponent() {
    const { listId } = Route.useParams();
    const list = Route.useLoaderData();

    return <EditList initialList={list} listId={listId} />;
}
